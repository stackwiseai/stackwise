import ffmpeg from "fluent-ffmpeg";
import { Readable } from "stream";

const ffmpegPath =  './node_modules/ffmpeg-static/ffmpeg'
ffmpeg.setFfmpegPath(ffmpegPath)

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
    
  } catch (error) {
    console.error(error);
    return Response.error();
  }
}
