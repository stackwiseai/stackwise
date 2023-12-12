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
    canvasRef.current?.exportImage('png').then((originalDataUrl) => {
      const image = new Image();
      image.onload = () => {
        const scaleCanvas = document.createElement('canvas');
        scaleCanvas.width = 512;
        scaleCanvas.height = 512;
        const ctx = scaleCanvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(image, 0, 0, 512, 512); // Draw and scale the image to 512x512
          const scaledDataUrl = scaleCanvas.toDataURL('image/png');
          setDataUriImage(scaledDataUrl); // This is now the scaled 512x512 image
        }
      };
      image.src = originalDataUrl; // Load the original exported image
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
      strength: 0.75,
      enable_safety_checks: false,
    });
  }, [dataUriImage, imagePrompt]);

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <input
        type="text"
        onChange={(e) => setImagePrompt(e.target.value)}
        value={imagePrompt}
        placeholder="Enter prompt..."
        className="p-2 pl-4 mb-2 w-full sm:w-3/4 md:w-1/2 border border-gray-300 rounded-full"
      />
      <div className="sm:flex h-[90vw] w-[90vw] sm:h-auto sm:w-1/2 lg:[45%] xl:w-2/5 justify-center">
        <ReactSketchCanvas
          ref={canvasRef}
          className="border aspect-square"
          strokeWidth={4}
          strokeColor="black"
          onChange={saveDrawing}
        />
        <div
          className="aspect-square bg-cover border-dotted border bg-no-repeat border-l-0"
          style={{
            backgroundImage: `url(${image})`,
          }}
        />
      </div>
    </div>
  );
};

export default CreateAICanvas;
