import { useEffect, useRef, useState } from 'react';
import * as fal from '@fal-ai/serverless-client';
import { ReactSketchCanvas, ReactSketchCanvasRef } from 'react-sketch-canvas';

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
      strength: 0.65,
      enable_safety_checks: true,
    });
  }, [dataUriImage, imagePrompt]);

  return (
    <div className="flex flex-col items-center justify-center sm:w-5/6 md:w-3/4 lg:w-2/3">
      <input
        type="text"
        onChange={(e) => setImagePrompt(e.target.value)}
        value={imagePrompt}
        placeholder="Enter prompt..."
        className="mb-2 w-full rounded-full border border-gray-300 p-2 pl-4 sm:w-3/4 md:w-1/2"
      />
      <div className="lg:[45%] h-[90vw] w-[90vw] justify-center sm:flex sm:h-auto sm:w-1/2 xl:w-2/5">
        <ReactSketchCanvas
          ref={canvasRef}
          className="aspect-square border"
          strokeWidth={4}
          strokeColor="black"
          onChange={saveDrawing}
        />
        <div
          className="aspect-square border border-l-0 border-dotted bg-cover bg-no-repeat"
          style={{
            backgroundImage: `url(${image})`,
          }}
        />
      </div>
    </div>
  );
};

export default CreateAICanvas;
