'use client';

import { useEffect, useState, useRef } from 'react';

export default function ImageToMusic() {
  const [img, setImg] = useState<File>(null);
  const [llavaResponse, setLlavaResponse] = useState<{
    description: string;
    prompt: string;
  }>(null);
  const [audio, setAudio] = useState<string>('');
  const [musicLength, setMusicLength] = useState<string>('10');
  const [loading, setLoading] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await fetch('/boat_example.webp');
        const blob = await response.blob();
        const file = new File([blob], 'default_image.webp', {
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
    if (audio) {
      setAudio('');
    }
    if (e.target.files && e.target.files[0]) {
      setImg(e.target.files[0]);
    }
  };

  const createMusic = async () => {
    if (loading) return;
    if (audio) {
      setAudio('');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('img', img);
    formData.append('length', musicLength.toString());
    const response = await fetch('/api/image-to-music', {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    setAudio(data.audio);
    setLlavaResponse(data.llavaResponse);
    setLoading(false);
  };

  useEffect(() => {
    if (audio) {
      audioRef.current?.load();
      audioRef.current?.play();
    }
  }, [audio]);

  const handleMusicLength = (e) => {
    let value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
      value = Math.max(3, Math.min(30, value));
    }
    setMusicLength(String(value));
  };

  return (
    <div className="flex-col mx-auto stretch flex justify-center items-center space-y-4 w-5/6 md:w-3/4 lg:w-2/3">
      <div className="flex justify-center items-center">
        <label
          htmlFor="customFileUpload"
          className="flex items-center mr-4 rounded-lg pl-2 py-1 cursor-pointer border-dashed border-2 w-full md:w-1/2"
        >
          <span id="pdfLabel" className="mr-2 whitespace-nowrap">
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
            <div className="text-gray-600 line-clamp-2 pr-2">{img.name}</div>
          )}
        </label>
        <>
          <span>Length (sec): </span>
          <input
            max={3}
            min={30}
            value={musicLength}
            onChange={(e) => setMusicLength(e.target.value)}
            onBlur={handleMusicLength}
            type="number"
            className="border rounded h-8 pl-1 ml-1"
          />
        </>
      </div>
      <div className="flex justify-center items-center space-x-4 w-full">
        {img && (
          <img
            src={URL.createObjectURL(img)}
            alt="Preview"
            className={`w-1/2 mx-auto ${loading && 'blur-sm'}`}
          />
        )}
        {audio && (
          <div className="w-1/2 px-6 space-y-3">
            <p>
              <b>Image description: </b>
              {llavaResponse.description}
            </p>
            <p>
              <b>Inspired music: </b>
              {llavaResponse.prompt}
            </p>
            <audio ref={audioRef} controls src={audio} className="w-full" />
          </div>
        )}
      </div>
      <button
        onClick={createMusic}
        disabled={loading}
        className={`${
          loading && 'bg-black text-white'
        } border-black border rounded-md py-1 px-3 font-medium`}
      >
        {audio
          ? 'Reset'
          : loading
          ? 'Loading, 10-30 secs...'
          : 'Create theme music'}
      </button>
    </div>
  );
}
