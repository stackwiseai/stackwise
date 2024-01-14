import ffmpeg from "fluent-ffmpeg";
import { Readable } from "stream";
import Replicate from "replicate";
import fs from 'fs';
import OpenAI from "openai";


const ffmpegPath =  './node_modules/ffmpeg-static/ffmpeg'
ffmpeg.setFfmpegPath(ffmpegPath)

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN as string,
});

// types
enum createAudioFileStatus{
  SUCCESS = 'Audio has been extracted Successfully !!!',
  FAILED  = 'Some error has occurred in extracting the audio !!!'
}

type createAudioFileOutput = {
  status : createAudioFileStatus,
  audioName : string,
}


// Generate random audio name
const createAudioName = () : string => {
  const charset = "abcdefghijklmnopqrstuvwxyz";
  let randomName = "";

  for (let i = 0; i < 10; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    randomName += charset.charAt(randomIndex);
  }

  return randomName;
}


const createAudioFile = (videoStream : Readable) : (Promise<createAudioFileOutput>) => {

  const audioName = createAudioName();

  return new Promise((res,rej) => {
    ffmpeg(videoStream)
      .output(`./${audioName}.mp3`)
      .outputFormat('mp3')
      .on('end', () => {
        console.log('Audio extraction finished');
        res({status:createAudioFileStatus.SUCCESS, audioName});
      })
      .on('error', (err) => {
        console.error('Error:', err);
        rej({status:createAudioFileStatus.FAILED, audioName});
      })
      .run();
  })
}

export async function POST(req: Request) {

  try {

      const form = await req.formData();
      const videoFile = form.get('video') as Blob;

      //convert this blob into buffer 
      const videoBuffer = Buffer.from(await videoFile.arrayBuffer());

      //create a VideoStream
      const videoStream = new Readable();
      videoStream.push(videoBuffer);
      videoStream.push(null);

      //extract the audio and create an audiofile from the video buffer
      const res = await createAudioFile(videoStream);

      if(res.status == createAudioFileStatus.FAILED){

        if(fs.existsSync(`./${res.audioName}.mp3`)){
          fs.unlinkSync(`./${res.audioName}.mp3`);
        }
        
        return Response.json({message:res});
      }

      const audioName = res.audioName;
      const audioBase64 = fs.readFileSync(`./${audioName}.mp3`,'base64');
      const audioUri = `data:audio/mp3;base64,${audioBase64}`;

      // send the audio to replicate and getback the subtitles and long descrp
      const output = await replicate.run(
        "m1guelpf/whisper-subtitles:7f686e243a96c7f6f0f481bcef24d688a1369ed3983cea348d1f43b879615766",
        {
          input: {
            format: "vtt",
            audio_path: audioUri,
            model_name: "base"
          }
        }
      );

      if(!output || !('text' in output) || !('subtitles' in output)){
        return Response.json({message:"Some Error occured in fetching subtitles !!"})
      }
    
      console.log("Subtitle has beeen generate Successfully !!")

      // send the long prompt to openAI and get back a short summary

      const prompt = output.text as string;
      const subtitle = output.subtitles as string;

      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{role:'system',content:`You are a Short and Crisp Text Summarizer. You will be given a large paragraph You should summarize the context a short summary of 10-15 words and not more than that. Give the summary directly, don't use words like "Okay,Sure" or "The paragraph , author or anyother words about the author or speaker ". Here is the paragraph ${prompt}.`}]
      });

      const summarizedText = completion.choices[0]?.message?.content;

      if(!summarizedText){
        return Response.json({message:"Summarizer is missing !!!"});
      }


      console.log("Generated Short Description !");

      return Response.json({message:"The Audio has been extracted and stored in the server !!!!"});
    
  } catch (error) {
    console.error(error);
    return Response.error();
  }
}
