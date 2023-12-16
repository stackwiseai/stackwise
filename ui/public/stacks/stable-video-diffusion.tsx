import React, { useCallback, useEffect, useRef, useState } from "react";

const StableVideoDiffusion = () => {
  const draftCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPosition, setLastPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [imgSrc, setImgSrc] = useState<string>("/boat_example.webp");
  const [loading, setLoading] = useState(false);
  const [degreeOfMotion, setDegreeOfMotion] = useState(40);
  const [animatedPicture, setAnimatedPicture] = useState("");
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
    window.addEventListener("resize", loadImage);

    // Cleanup the event listener on component unmount
    return () => window.removeEventListener("resize", loadImage);
  }, [imgSrc]);

  const draw = useCallback(
    (clientX: number, clientY: number) => {
      const draftCanvas = draftCanvasRef.current;
      if (!draftCanvas) return;

      const rect = draftCanvas.getBoundingClientRect();
      const ctx = draftCanvas.getContext("2d");
      if (!ctx) return;

      const x = clientX - rect.left;
      const y = clientY - rect.top;

      if (lastPosition) {
        ctx.strokeStyle = "rgb(0,0,0)"; // Set stroke color
        ctx.lineWidth = 40; // Set stroke width
        ctx.lineCap = "round"; // Smooth line endings

        ctx.beginPath();
        ctx.moveTo(lastPosition.x, lastPosition.y);
        ctx.lineTo(x, y);
        ctx.stroke();
      }

      setLastPosition({ x, y });
    },
    [lastPosition],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDrawing) return;
      draw(e.clientX, e.clientY);
    },
    [draw, isDrawing],
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
    if (animatedPicture) {
      setAnimatedPicture("");
    }
    if (e.target.files && e.target.files[0]) {
      const newImgSrc = URL.createObjectURL(e.target.files[0]);
      setImgSrc(newImgSrc); // Update the imgSrc state

      const image = imageRef.current;
      image.onload = () => resizeCanvas(image); // Use the ref's current image for resizing
      image.src = newImgSrc; // Update the image source in the ref
    }
  };

  const handleDegreeOfMotionChange = (e) => {
    let value = parseInt(e.target.value, 10);
    // Ensure the value is between 1 and 255
    if (!isNaN(value)) {
      value = Math.max(1, Math.min(255, value));
    }
    setDegreeOfMotion(value);
  };

  const resizeCanvas = (img) => {
    const parentDiv = document.querySelector(".canvas-img");
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
    // Reset and setup code
    if (animatedPicture) {
      setAnimatedPicture("");
      resizeCanvas(imageRef.current);
      return;
    }
    setLoading(true);

    // Convert the drawing on the main canvas to a Blob
    const mainCanvasBlob = await new Promise((resolve) => {
      if (draftCanvasRef.current) {
        draftCanvasRef.current.toBlob(resolve, "image/png");
      }
    });

    try {
      // Fetch the background image from the imgSrc URL and convert it to a Blob
      const response = await fetch(imgSrc);
      const backgroundImageBlob = await response.blob();

      // Prepare FormData
      const formData = new FormData();
      formData.append("img", backgroundImageBlob, "background.png");
      formData.append("mask", mainCanvasBlob as Blob, "mask.png");
      const ensureMotion = isNaN(degreeOfMotion) ? 40 : degreeOfMotion;
      formData.append("degreeOfMotion", ensureMotion.toString());

      // Call the API with FormData
      const apiResponse = await fetch("/api/stable-video-diffusion", {
        method: "POST",
        body: formData, // FormData is used directly here
      });

      const resultData = await apiResponse.json();

      if (!apiResponse.ok) throw new Error(resultData.error);

      // Update state with the returned GIF URL
      setAnimatedPicture(resultData.image.url);
    } catch (error) {
      console.error("Error during API call:", error);
    }

    setLoading(false);
  };

  return (
    <div className="flex h-[125%] w-5/6 flex-col items-center space-y-4 md:w-3/4">
      <div className="items-center sm:flex">
        <input
          type="file"
          accept="image/*"
          disabled={loading}
          onChange={handleImageUpload}
          className="mr-2 w-24 cursor-pointer rounded-md border-2 border-dashed py-1 file:border-0 file:bg-transparent file:text-sm file:font-semibold md:w-auto"
        />
        <label className="mr-1">Motion level (1-255):</label>
        <input
          placeholder="Enter motion..."
          max={255}
          min={1}
          value={degreeOfMotion}
          onChange={handleDegreeOfMotionChange}
          type="number"
          className="w-20 rounded-md border px-1 py-1"
        />
      </div>
      <div
        className={`canvas-img relative flex h-full w-full ${
          loading && "pointer-events-none blur"
        }`}
      >
        <img
          style={{ width: canvasSize.width, height: canvasSize.height }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform"
          src={animatedPicture ? animatedPicture : imgSrc}
          alt="Animated image"
        />
        <canvas
          ref={draftCanvasRef}
          className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform opacity-[65%] ${
            animatedPicture && "hidden"
          }`}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className={`${
          loading && "bg-black text-white"
        } rounded-md border border-black px-3 py-1 font-medium`}
      >
        {animatedPicture
          ? "Reset"
          : loading
            ? "Loading, up to 2 minutes..."
            : "Animate"}
      </button>
    </div>
  );
};

export default StableVideoDiffusion;
