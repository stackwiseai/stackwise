import React, { useRef, useEffect, useState, useCallback } from 'react';

const MagicAnimate = () => {
  const mainCanvasRef = useRef<HTMLCanvasElement>(null);
  const draftCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPosition, setLastPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [image, setImage] = useState<HTMLImageElement | null>();

  useEffect(() => {
    console.log('Component mounted, loading image.'); // Log when component mounts

    const img = new Image();
    img.onload = () => {
      console.log('Image loaded successfully.'); // Log on successful image load
      setImage(img);
      resizeCanvas(img); // Ensure this function is implemented correctly
    };
    img.onerror = () => {
      console.error('Error loading image.'); // Log on image load error
    };
    img.src = '/boat_lake.jpg'; // The path used in the browser

    return () => console.log('Component unmounted.'); // Log on component unmount
  }, []);

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
    const mainCanvas = mainCanvasRef.current;
    const draftCanvas = draftCanvasRef.current;
    if (mainCanvas && draftCanvas) {
      const mctx = mainCanvas.getContext('2d');
      if (mctx) {
        mctx.globalAlpha = 0.65; // Set the opacity for the main canvas
        mctx.drawImage(draftCanvas, 0, 0); // Draw the draft canvas onto the main canvas
        mctx.globalAlpha = 1; // Reset the opacity
        draftCanvas
          .getContext('2d')
          ?.clearRect(0, 0, draftCanvas.width, draftCanvas.height); // Clear the draft canvas
      }
    }
    setLastPosition(null);
  }, []);

  // Function to handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const img = new Image();
      img.onload = () => {
        setImage(img);
        resizeCanvas(img);
      };
      img.src = URL.createObjectURL(e.target.files[0]);
    }
  };

  const resizeCanvas = (img) => {
    const parentDiv = document.querySelector('.canvas-img');
    if (!parentDiv || !mainCanvasRef.current || !draftCanvasRef.current) return;

    const parentWidth = parentDiv.clientWidth;
    const parentHeight = parentDiv.clientHeight;
    const imgRatio = img.width / img.height;
    const parentRatio = parentWidth / parentHeight;

    let newWidth, newHeight;

    if (imgRatio > parentRatio) {
      // Image is wider than it is tall
      newWidth = parentWidth;
      newHeight = parentWidth / imgRatio;
    } else {
      // Image is taller than it is wide
      newHeight = parentHeight;
      newWidth = parentHeight * imgRatio;
    }

    mainCanvasRef.current.width = newWidth;
    draftCanvasRef.current.width = newWidth;
    mainCanvasRef.current.height = newHeight;
    draftCanvasRef.current.height = newHeight;

    // Redraw the image centered
    const ctx = mainCanvasRef.current.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, parentWidth, parentHeight); // Clear the canvas before drawing
      ctx.drawImage(img, 0, 0, newWidth, newHeight);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (image) resizeCanvas(image);
    };

    if (image) {
      resizeCanvas(image);
    }

    // Add a throttled resize event listener
    window.addEventListener('resize', handleResize);

    // Cleanup the event listener on component unmount
    return () => window.removeEventListener('resize', handleResize);
  }, [image]);

  return (
    <div className="w-5/6 md:w-3/4 h-[125%] space-y-4 flex flex-col items-center">
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="w-24 md:w-auto pt-1 pb-2 cursor-pointer border-dotted border-2 rounded-md file:border-0 file:bg-transparent file:text-sm file:font-semibold"
      />
      <div className="flex relative w-full h-full canvas-img">
        <canvas
          ref={mainCanvasRef}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        />
        <canvas
          ref={draftCanvasRef}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-[65%]"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
        />
      </div>

      <button className="border rounded-md py-1 px-2">Animate</button>
    </div>
  );
};

export default MagicAnimate;
