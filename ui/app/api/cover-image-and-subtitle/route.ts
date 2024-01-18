import { spawn } from 'child_process';
import fs from 'fs';
import { Readable } from 'stream';
import AWS from 'aws-sdk';
import OpenAI from 'openai';
import Replicate from 'replicate';
import { v4 as uuidv4 } from 'uuid';

AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const s3 = new AWS.S3();
const transcoder = new AWS.ElasticTranscoder();

export const maxDuration = 300;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN as string,
});

// Function to check the status of a transcoding job
const checkTranscodeJobStatus = async (jobId) => {
  const params = { Id: jobId };
  return transcoder.readJob(params).promise();
};

// Function to wait for the job to complete
const waitForJobCompletion = async (jobId, interval = 50, timeout = 30000) => {
  let timePassed = 0;

  while (timePassed < timeout) {
    const { Job } = await checkTranscodeJobStatus(jobId);
    if (Job) {
      console.log('Job status:', Job.Status);
      if (Job.Status === 'Complete') {
        return true;
      } else if (Job.Status === 'Error') {
        // Log or return the specific error message from the job
        throw new Error(`Transcoding job failed from an Error`);
      }

      // Wait for the specified interval before checking again
      await new Promise((resolve) => setTimeout(resolve, interval));
      timePassed += interval;
    } else {
      throw new Error('Transcoding job failed: Job status not available');
    }
  }

  throw new Error('Transcoding job timed out');
};

const startTranscodeJob = async (inputKey, outputKey, pipelineId, presetId) => {
  const params = {
    PipelineId: pipelineId,
    Input: { Key: inputKey },
    Outputs: [{ Key: outputKey, PresetId: presetId }],
  };
  return transcoder.createJob(params).promise();
};

// Function to get the base64 string of the audio file
const getAudioBase64 = async (bucketName, audioKey) => {
  const params = {
    Bucket: bucketName,
    Key: audioKey,
  };
  try {
    const data = await s3.getObject(params).promise();
    if (data.Body) {
      return data.Body.toString('base64');
    } else {
      throw new Error('No data body in response');
    }
  } catch (error) {
    console.error('Error getting audio base64:', error);
    throw error; // Re-throw the error for handling it in the calling function
  }
};

const createAudioFile = async (fileName: string): Promise<string> => {
  const pipelineId = '1705538698802-kk2tc9'; // Replace with your pipeline ID
  const presetId = '1705539076861-v8ozl7'; // MP3 preset ID
  const inputBucket = 'cover-image-and-subtitle-stack'; // Your input bucket name
  const outputBucket = 'cover-image-and-subtitle-stack'; // Your output bucket name
  const inputKey = fileName;
  // Replace only the last occurrence of .mp4 with .mp3
  let outputKey = fileName.replace(/\.mp4$/, '.mp3');

  try {
    // Check if the output file already exists
    try {
      await s3.headObject({ Bucket: outputBucket, Key: outputKey }).promise();
      // File exists, create a new unique name
      outputKey = `${fileName.split('.')[0]}-${Date.now()}.mp3`;
    } catch (error) {
      if (error.statusCode !== 404) {
        throw error; // An error other than 'Not Found'
      }
      // If error is 404 (Not Found), it means file does not exist and we can proceed
    }
    // Start the transcoding job
    const transcodeResponse = await startTranscodeJob(
      inputKey,
      outputKey,
      pipelineId,
      presetId,
    );

    if (transcodeResponse.Job) {
      // Wait for the job to complete
      await waitForJobCompletion(transcodeResponse.Job.Id);

      // Get the base64 encoded audio string
      const audioBase64 = await getAudioBase64(outputBucket, outputKey);

      return `data:audio/mp3;base64,${audioBase64}`;
    } else {
      throw new Error('No job ID in response');
    }
  } catch (error) {
    console.error('Error in createAudioFile:', error);
    return '';
  }
};

export async function POST(req: Request) {
  try {
    const body = await req.json();

    //extract the audio and create an audiofile from the video buffer
    const audioUri = await createAudioFile(body.fileName);

    // send the audio to replicate and getback the subtitles and long descrp
    const output = await replicate.run(
      'm1guelpf/whisper-subtitles:7f686e243a96c7f6f0f481bcef24d688a1369ed3983cea348d1f43b879615766',
      {
        input: {
          format: 'vtt',
          audio_path: audioUri,
          model_name: 'base',
        },
      },
    );

    if (!output || !('text' in output) || !('subtitles' in output)) {
      return Response.json({
        message: 'Some Error occured in fetching subtitles !!',
      });
    }

    console.log('Subtitle has beeen generate Successfully !!');

    // send the long prompt to openAI and get back a short summary

    const prompt = output.text as string;
    const subtitle = output.subtitles as string;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are a subtitle summarizer. You will be given a large paragraph of subtitles from a video. Your goal is to summarize the video based on what was said within. Keep the summary to only a few sentences and not more than that. Give the summary directly, don't use words like "Okay,Sure" or "The paragraph" or "author" or any other words about the author or speaker. Here are the original subtitles ${prompt}.`,
        },
      ],
    });

    const summarizedText = completion.choices[0]?.message?.content;

    if (!summarizedText) {
      return Response.json({ message: 'Summarizer is missing !!!' });
    }

    console.log('Generated Short Description !');

    // send the short summary to replicate and generate back an image
    const imgArr = await replicate.run(
      'stability-ai/stable-diffusion:ac732df83cea7fff18b8472768c88ad041fa750ff7682a21affe81863cbe77e4',
      {
        input: {
          prompt: `Generate a thumbnail for the following content. It should be scenic with no text on it, make sure it ABSOLUTELY does not have any text embedded on it. Understand the following prompt and generate a high quality image without any text: ${summarizedText}`,
          width: 1024,
          height: 576,
          scheduler: 'K_EULER',
        },
      },
    );

    if (!imgArr || !imgArr[0]) {
      return Response.json({
        message: 'Some Error occured in Image Generation !!',
      });
    }

    console.log('The Image generated Successfully !!!');
    const imgUrl = imgArr[0] as string;

    return Response.json({
      message: 'The Audio has been extracted and stored in the server !',
      subtitle,
      imgUrl,
      summarizedText,
    });
  } catch (error) {
    console.error(error);
    return Response.error();
  }
}
