'use client';

import { useEffect, useRef, useState } from 'react';

export default function ImageToMusic() {
  const [img, setImg] = useState<File | null>(null);
  const [llavaResponse, setLlavaResponse] = useState<{
    description: string;
    prompt: string;
  }>({ description: '', prompt: '' }); // Provide initial values here
  const [audio, setAudio] = useState<string>('');
  const [musicLength, setMusicLength] = useState<string>('10');
  const [loading, setLoading] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await fetch('/apocalyptic_car.png');
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
    if (img) {
      formData.append('img', img);
    }
    formData.append('length', musicLength.toString());
    const response = await fetch('/api/stacks/image-to-music', {
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
      (audioRef.current as HTMLAudioElement | null)?.load();
      (audioRef.current as HTMLAudioElement | null)?.play();
    }
  }, [audio]);

  const handleMusicLength = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
      value = Math.max(3, Math.min(30, value));
    }
    setMusicLength(String(value));
  };

  return (
    <div className="stretch mx-auto flex w-5/6 flex-col items-center justify-center space-y-4 pb-10 md:w-3/4 lg:w-2/3">
      <div className="flex items-center justify-center">
        <label
          htmlFor="customFileUpload"
          className="mr-4 flex w-full cursor-pointer items-center rounded-lg border-2 border-dashed py-1 pl-2 md:w-1/2"
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
            <div className="line-clamp-2 pr-2 text-gray-600">{img.name}</div>
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
            className="ml-1 h-8 rounded border pl-1"
          />
        </>
      </div>
      <div className="flex w-full items-center justify-center space-x-4">
        {img && (
          <img
            src={URL.createObjectURL(img)}
            alt="Preview"
            className={`mx-auto w-1/2 ${loading && 'blur-sm'}`}
          />
        )}
        {audio && (
          <div className="w-1/2 space-y-3 px-6">
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
        } rounded-md border border-black px-3 py-1 font-medium`}
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
