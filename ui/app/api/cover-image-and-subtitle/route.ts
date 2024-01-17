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

export const maxDuration = 300;

// initial config
const ffmpegPath = './node_modules/ffmpeg-static/ffmpeg';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN as string,
});

// types
enum createAudioFileStatus {
  SUCCESS = 'Audio has been extracted Successfully !!!',
  FAILED = 'Some error has occurred in extracting the audio !!!',
}

type createAudioFileOutput = {
  status: createAudioFileStatus;
  audioName: string;
};

// Generate random audio name using UUID for uniqueness
const createAudioName = (): string => {
  return uuidv4();
};

const createAudioFile = (
  videoStream: Readable,
): Promise<createAudioFileOutput> => {
  // Generate the base name without extension
  const baseAudioName = createAudioName();
  const audioName = `${baseAudioName}.mp3`; // Correctly append .mp3 extension

  return new Promise((resolve, reject) => {
    const ffmpegProcess = spawn(ffmpegPath, [
      '-i',
      'pipe:0', // Read input from stdin
      '-vn', // No video
      '-acodec',
      'mp3', // Convert to mp3
      '-f',
      'mp3', // Output format as mp3
      'pipe:1', // Write output to stdout
    ]);

    // Pipe video stream to ffmpeg's stdin
    videoStream.pipe(ffmpegProcess.stdin);

    // Handle output stream
    let audioBuffer = Buffer.alloc(0);
    ffmpegProcess.stdout.on('data', (chunk) => {
      audioBuffer = Buffer.concat([audioBuffer, chunk]);
    });

    ffmpegProcess.on('close', (code) => {
      if (code !== 0) {
        reject({
          status: createAudioFileStatus.FAILED,
          audioName: baseAudioName,
        });
      } else {
        // Write the audio buffer to file with the correct file name
        fs.writeFileSync(audioName, audioBuffer);
        console.log('Audio extraction finished');
        resolve({
          status: createAudioFileStatus.SUCCESS,
          audioName: baseAudioName,
        });
      }
    });

    ffmpegProcess.stderr.on('data', (data) => {
      console.error(`ffmpeg stderr: ${data}`);
    });

    ffmpegProcess.on('error', (err) => {
      console.error('Failed to start ffmpeg process:', err);
      reject({
        status: createAudioFileStatus.FAILED,
        audioName: baseAudioName,
      });
    });
  });
};

async function streamToBuffer(stream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on('data', (chunk: never) => chunks.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', reject);
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const params = {
      Bucket: 'cover-image-and-subtitle-stack',
      Key: body.fileName,
    };

    const s3 = new AWS.S3();

    const data = await s3.getObject(params).promise();

    let videoStream;

    if (data.Body) {
      let videoBuffer;

      if (data.Body instanceof Buffer) {
        // If Body is already a Buffer
        videoBuffer = data.Body;
      } else if (data.Body instanceof Readable) {
        // If Body is a Readable stream
        videoBuffer = await streamToBuffer(data.Body);
      } else {
        return Response.json({
          message: 'Unhandled type of S3 Body !!',
        });
      }

      // Create a Readable stream from the buffer
      videoStream = new Readable({
        read() {},
      });
      videoStream.push(videoBuffer);
      videoStream.push(null); // End of the stream

      // Now you can use videoStream as needed
    } else {
      return Response.json({
        message: 'Some Error occurred in fetching video !!',
      });
    }

    //extract the audio and create an audiofile from the video buffer
    const res = await createAudioFile(videoStream);

    if (res.status == createAudioFileStatus.FAILED) {
      if (fs.existsSync(`./${res.audioName}.mp3`)) {
        fs.unlinkSync(`./${res.audioName}.mp3`);
      }

      return Response.json({ message: res });
    }

    const audioName = res.audioName;
    const audioBase64 = fs.readFileSync(`./${audioName}.mp3`, 'base64');
    const audioUri = `data:audio/mp3;base64,${audioBase64}`;

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
          content: `You are a Short and Crisp Text Summarizer. You will be given a large paragraph You should summarize the context a short summary of 10-15 words and not more than that. Give the summary directly, don't use words like "Okay,Sure" or "The paragraph , author or anyother words about the author or speaker ". Here is the paragraph ${prompt}.`,
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

    //remove the created audio file
    if (fs.existsSync(`./${res.audioName}.mp3`)) {
      fs.unlinkSync(`./${res.audioName}.mp3`);
    }

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
