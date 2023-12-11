import { useState, useRef, useEffect } from 'react';
import { ReactSketchCanvas, ReactSketchCanvasRef } from 'react-sketch-canvas';
import * as fal from '@fal-ai/serverless-client';

fal.config({
  credentials: `${process.env.NEXT_PUBLIC_FAL_KEY_ID}:${process.env.NEXT_PUBLIC_FAL_KEY_SECRET}`,
});

const CreateAICanvas: React.FC = () => {
  const [dataUriImage, setDataUriImage] = useState<string>('');
  const [image, setImage] = useState<string>('');
  const [imagePrompt, setImagePrompt] = useState<string>('');
  const canvasRef = useRef<ReactSketchCanvasRef>(null);

  const saveDrawing = () => {
    canvasRef.current?.exportImage('png').then((dataUrl) => {
      setDataUriImage(dataUrl);
    });
  };

  const connection = fal.realtime.connect('110602490-lcm-sd15-i2i', {
    connectionKey: 'fal-realtime-example',
    clientOnly: false,
    throttleInterval: 256,
    onResult: (result) => {
      console.log(result);
      if (result.images && result.images[0]) {
        setImage(result.images[0].url);
      }
    },
    onError: (error) => {
      console.error(error);
    },
  });

  useEffect(() => {
    connection.send({
      prompt: imagePrompt,
      sync_mode: true,
      image_url: dataUriImage,
      strength: 0.65,
      enable_safety_checks: false,
    });
  }, [dataUriImage, imagePrompt]);

  return (
    <div className="flex flex-col items-center justify-center">
      <input
        type="text"
        onChange={(e) => setImagePrompt(e.target.value)}
        value={imagePrompt}
        placeholder="Enter prompt..."
        className="p-2 pl-4 mb-2 w-3/4 border border-gray-300 rounded-full"
      />
      <div className="flex">
        <ReactSketchCanvas
          ref={canvasRef}
          className="border"
          style={{
            width: '512px',
            height: '512px',
          }}
          strokeWidth={4}
          strokeColor="black"
          onChange={saveDrawing}
        />
        <div
          style={{
            width: '512px',
            height: '512px',
            backgroundImage: `url(${image})`,
            backgroundSize: 'cover',
            borderLeft: 'none',
          }}
        />
      </div>
    </div>
  );
};

export default CreateAICanvas;
