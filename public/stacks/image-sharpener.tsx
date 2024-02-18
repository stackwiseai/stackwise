'use client';

import React, { useEffect, useState } from 'react';
import {
  ReactCompareSlider,
  ReactCompareSliderImage,
} from 'react-compare-slider';

export default function ImageToMusic() {
  const [img, setImg] = useState<File | null>(null);
  const [sharpenedImage, setSharpenedImage] = useState<string | null>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await fetch('/caesar.jpeg');
        const blob = await response.blob();
        const file = new File([blob], 'caesar.jpeg', {
          type: 'image/webp',
        });
        setImg(file);
      } catch (error) {
        console.error('Error fetching default image:', error);
      }
    };

    fetchImage();
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (sharpenedImage) {
      setSharpenedImage('');
    }
    if (e.target.files && e.target.files[0]) {
      setImg(e.target.files[0]);
    }
  };

  const sharpenImage = async () => {
    if (loading) return;
    if (sharpenedImage) {
      setSharpenedImage('');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    if (img) {
      formData.append('img', img);
    }
    const response = await fetch('/api/stacks/image-sharpener', {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    console.log(data);
    setSharpenedImage(data);
    setLoading(false);
  };

  return (
    <div className="stretch mx-auto flex w-5/6 flex-col items-center justify-center space-y-4 pb-10 md:w-3/4 lg:w-2/3">
      <div className="flex items-center justify-center">
        <label
          htmlFor="customFileUpload"
          className="mr-4 flex w-full cursor-pointer items-center rounded-lg border-2 border-dashed py-1 pl-2 md:w-5/6"
        >
          <span id="pdfLabel" className="tex-center mr-2 whitespace-nowrap">
            Upload Image
          </span>
          <input
            type="file"
            onChange={handleImageUpload}
            disabled={loading}
            aria-labelledby="pdfLabel"
            accept="image/*"
            id="customFileUpload"
            className="hidden"
          />
          {img && (
            <div className="line-clamp-2 pr-2 text-gray-600">{img.name}</div>
          )}
        </label>
      </div>
      <div className="flex w-full items-center justify-center space-x-4">
        {sharpenedImage && img ? (
          <div className="flex w-full items-center justify-center">
            <p className="-rotate-90 font-bold">Before</p>
            <ReactCompareSlider
              className="w-1/2"
              itemOne={
                <ReactCompareSliderImage
                  src={URL.createObjectURL(img)}
                  alt="original img"
                />
              }
              itemTwo={
                <ReactCompareSliderImage
                  src={sharpenedImage}
                  alt="sharpened img"
                />
              }
            />
            <p className="rotate-90 font-bold">After</p>
          </div>
        ) : (
          img && (
            <img
              src={URL.createObjectURL(img)}
              alt="Preview"
              className={`mx-auto w-1/2 ${loading && 'blur-sm'}`}
            />
          )
        )}
      </div>
      <button
        onClick={sharpenImage}
        disabled={loading}
        className={`${
          loading && 'bg-black text-white'
        } rounded-md border border-black px-3 py-1 font-medium`}
      >
        {sharpenedImage
          ? 'Reset'
          : loading
            ? 'Loading, 10 secs...'
            : 'Sharpen image'}
      </button>
    </div>
  );
}
