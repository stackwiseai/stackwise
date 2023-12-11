import { useState, useRef, useEffect } from 'react';
import { ReactSketchCanvas, ReactSketchCanvasRef } from 'react-sketch-canvas';
import * as fal from '@fal-ai/serverless-client';

fal.config({
  credentials: `${process.env.NEXT_PUBLIC_FAL_KEY_ID}:${process.env.NEXT_PUBLIC_FAL_KEY_SECRET}`, // or a function that returns a string
});

interface CreateAICanvasProps {
  // Additional props can be added here if needed
}

const CreateAICanvas: React.FC<CreateAICanvasProps> = () => {
  const [svgImage, setSvgImage] = useState<string>('');
  const [image, setImage] = useState<string>('');
  const [imagePrompt, setImagePrompt] = useState<string>('');
  const canvasRef = useRef<ReactSketchCanvasRef>(null);

  const saveDrawing = () => {
    canvasRef.current?.exportImage('png').then((dataUrl) => {
      setSvgImage(dataUrl);
    });
  };

  const connection = fal.realtime.connect('110602490-lcm-sd15-i2i', {
    onResult: (result) => {
      console.log(result);
      setImage(result);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  useEffect(() => {
    connection.send({
      prompt: imagePrompt,
      sync_mode: true,
      image_url: svgImage,
    });
  }, [svgImage]);

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
            width: '450px',
            height: '450px',
          }}
          strokeWidth={4}
          strokeColor="black"
          onChange={saveDrawing}
        />
        <div
          style={{
            width: '450px',
            height: '450px',
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
