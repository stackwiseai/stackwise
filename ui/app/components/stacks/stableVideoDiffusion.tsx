import React, { useRef, useEffect, useState, useCallback } from 'react';

const MagicAnimate = () => {
  const draftCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPosition, setLastPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [imgSrc, setImgSrc] = useState<string>('/boat_lake.jpg');
  const [loading, setLoading] = useState(false);
  const [animatedPicture, setAnimatedPicture] = useState('');
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const imageRef = useRef(new Image());

  useEffect(() => {
    const loadImage = () => {
      const image = imageRef.current;
      image.onload = () => resizeCanvas(image); // Resize canvas when image is loaded
      image.src = imgSrc; // Set the image source
    };

    loadImage();

    // Add a throttled resize event listener
    window.addEventListener('resize', loadImage);

    // Cleanup the event listener on component unmount
    return () => window.removeEventListener('resize', loadImage);
  }, [imgSrc]);

  const draw = useCallback(
    (clientX: number, clientY: number) => {
      const draftCanvas = draftCanvasRef.current;
      if (!draftCanvas) return;

      const rect = draftCanvas.getBoundingClientRect();
      const ctx = draftCanvas.getContext('2d');
      if (!ctx) return;

      const x = clientX - rect.left;
      const y = clientY - rect.top;

      if (lastPosition) {
        ctx.strokeStyle = 'rgb(0,0,0)'; // Set stroke color
        ctx.lineWidth = 40; // Set stroke width
        ctx.lineCap = 'round'; // Smooth line endings

        ctx.beginPath();
        ctx.moveTo(lastPosition.x, lastPosition.y);
        ctx.lineTo(x, y);
        ctx.stroke();
      }

      setLastPosition({ x, y });
    },
    [lastPosition]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDrawing) return;
      draw(e.clientX, e.clientY);
    },
    [draw, isDrawing]
  );

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDrawing(true);
    const draftCanvas = draftCanvasRef.current;
    const rect = draftCanvas?.getBoundingClientRect();
    if (rect) {
      setLastPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsDrawing(false);
    setLastPosition(null);
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const newImgSrc = URL.createObjectURL(e.target.files[0]);
      setImgSrc(newImgSrc); // Update the imgSrc state

      const image = imageRef.current;
      image.onload = () => resizeCanvas(image); // Use the ref's current image for resizing
      image.src = newImgSrc; // Update the image source in the ref
    }
  };

  const resizeCanvas = (img) => {
    const parentDiv = document.querySelector('.canvas-img');
    if (!parentDiv || !draftCanvasRef.current) return;

    const parentWidth = parentDiv.clientWidth;
    const parentHeight = parentDiv.clientHeight;
    const imgRatio = img.naturalWidth / img.naturalHeight;
    let newWidth, newHeight;

    if (parentWidth / parentHeight > imgRatio) {
      // Parent is wider than image aspect ratio
      newHeight = parentHeight;
      newWidth = newHeight * imgRatio;
    } else {
      // Parent is narrower than image aspect ratio
      newWidth = parentWidth;
      newHeight = newWidth / imgRatio;
    }

    draftCanvasRef.current.width = newWidth;
    draftCanvasRef.current.height = newHeight;

    setCanvasSize({ width: newWidth, height: newHeight });
  };

  const handleSubmit = async () => {
    if (animatedPicture) {
      setAnimatedPicture('');
      return;
    }
    setLoading(true);

    // Convert the drawing on the main canvas to a PNG data URL
    const mainCanvasDataURL = draftCanvasRef.current.toDataURL('image/png');
    // Convert the background image to a data URL
    const image = imageRef.current;

    const canvas = document.createElement('canvas');
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    ctx.drawImage(image, 0, 0);
    const backgroundImageDataURL = canvas.toDataURL('image/png');

    try {
      // Call the API
      const response = await fetch('/api/stableVideoDiffusion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          img: backgroundImageDataURL,
          mask: mainCanvasDataURL,
        }),
      });

      const resultData = await response.json();

      if (!response.ok) throw new Error(resultData.error);

      // Update state with the returned GIF URL
      setAnimatedPicture(resultData.image.url);
    } catch (error) {
      console.error('Error during API call:', error);
    }

    setLoading(false);
  };

  return (
    <div className="w-5/6 h-[125%] md:w-3/4 space-y-4 flex flex-col items-center">
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="w-24 md:w-auto pt-1 pb-2 cursor-pointer border-dashed border-2 rounded-md file:border-0 file:bg-transparent file:text-sm file:font-semibold"
      />

      <div
        className={`flex relative w-full h-full canvas-img ${
          loading && 'blur pointer-events-none'
        }`}
      >
        <img
          style={{ width: canvasSize.width, height: canvasSize.height }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          src={animatedPicture ? animatedPicture : imgSrc}
          alt="Animated image"
        />
        {!animatedPicture && (
          <canvas
            ref={draftCanvasRef}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-[65%]"
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
          />
        )}
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className={`${
          loading && 'bg-black text-white'
        } border-black border rounded-md py-1 px-3 font-medium`}
      >
        {animatedPicture
          ? 'Reset'
          : loading
          ? 'Loading, up to 2 minutes...'
          : 'Animate'}
      </button>
    </div>
  );
};

export default MagicAnimate;
