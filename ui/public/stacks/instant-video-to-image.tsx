import { useState, useRef, useEffect } from 'react';
import * as fal from '@fal-ai/serverless-client';

fal.config({
  credentials: `${process.env.NEXT_PUBLIC_FAL_KEY_ID}:${process.env.NEXT_PUBLIC_FAL_KEY_SECRET}`,
});

const InstantVideoToImage: React.FC = () => {
  const [image, setImage] = useState<string>('');
  const [videoImage, setVideoImage] = useState<string>('');
  const [imagePrompt, setImagePrompt] = useState<string>('ryan reynolds');
  const [videoHeight, setVideoHeight] = useState(0);
  const [strength, setStrength] = useState<number>(4);
  const videoRef = useRef<HTMLVideoElement>(null);
  const intervalRef = useRef<NodeJS.Timeout>();

  const captureImage = () => {
    if (videoRef.current) {
      const scaleCanvas = document.createElement('canvas');
      scaleCanvas.width = 512;
      scaleCanvas.height = 512;
      const ctx = scaleCanvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, 512, 512);
        const dataUriImage = scaleCanvas.toDataURL('image/png');
        setVideoImage(dataUriImage);
      }
    }
  };

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setVideoHeight(entry.target.clientHeight);
      }
    });

    if (videoRef.current) {
      resizeObserver.observe(videoRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((error) => {
        console.error('Error accessing the camera: ', error);
      });

    intervalRef.current = setInterval(captureImage, 75); // Capture image every 0.1 seconds

    const timeoutRef = setTimeout(() => {
      clearInterval(intervalRef.current);
      if (videoRef.current?.srcObject instanceof MediaStream) {
        videoRef.current.pause(); // Pause the video

        // Apply a blur effect to the video
        videoRef.current.style.filter = 'blur(6px)';
      }
    }, 100000);

    return () => {
      clearInterval(intervalRef.current);
      clearTimeout(timeoutRef); // Clear the timeout on unmount
      // Stop video stream
      if (videoRef.current?.srcObject instanceof MediaStream) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
        videoRef.current.style.filter = 'none';
      }
    };
  }, []);

  const connection = fal.realtime.connect('110602490-lcm-sd15-i2i', {
    connectionKey: 'fal-realtime-example',
    clientOnly: false,
    throttleInterval: 75,
    onResult: (result) => {
      if (result.images && result.images[0]) {
        setImage(result.images[0].url);
      }
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const range = [1, 10];

  useEffect(() => {
    const scaledValue =
      ((strength - 1) * (0.6 - 0.1)) / (range[1] - range[0]) + 0.1;
    connection.send({
      prompt: imagePrompt,
      sync_mode: true,
      image_url: videoImage,
      strength: scaledValue,
      enable_safety_checks: false,
    });
  }, [videoImage, imagePrompt, strength]);

  const handleStrengthChange = (e) => {
    let value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
      value = Math.max(range[0], Math.min(range[1], value));
    }
    setStrength(value);
  };

  return (
    <div className="flex flex-col items-center justify-center sm:w-5/6 md:w-3/4 lg:w-2/3">
      <div className="flex items-center justify-center gap-4 w-full">
        <input
          type="text"
          onChange={(e) => setImagePrompt(e.target.value)}
          value={imagePrompt}
          placeholder="Enter prompt..."
          className="p-2 pl-4 mb-2 w-full sm:w-3/4 md:w-1/2 border border-gray-300 rounded-full"
        />
        <label>
          Strength ({range[0]}-{range[1]}):
        </label>
        <input
          max={range[1]}
          min={range[0]}
          value={strength}
          onChange={handleStrengthChange}
          type="number"
          className="border rounded h-8 -ml-2 pl-1 -pr-1"
        />
      </div>
      <p className="text-sm text-gray-400 mb-3 mt-1">
        For cost reasons this will only run for 10 seconds
      </p>
      <div className="flex flex-col sm:flex-row h-[90vw] w-[90vw] sm:h-auto sm:justify-center items-center">
        <video ref={videoRef} autoPlay className="w-5/6 sm:w-1/2" />
        <img
          className="w-5/6 sm:w-1/2"
          src={image ? image : '/placeholder.png'}
          style={{ height: `${videoHeight}px` }}
        />
      </div>
    </div>
  );
};

export default InstantVideoToImage;
