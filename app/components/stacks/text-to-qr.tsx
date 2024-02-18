'use client';

import { useState } from 'react';

export default function ImageToMusic() {
  const [qrPrompt, setQrPrompt] = useState<string>('a city view with clouds');
  const [url, setUrl] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [img, setImg] = useState<string>('');

  const createMusic = async () => {
    if (loading) return;
    if (img) {
      setImg('');
      return;
    }

    setLoading(true);

    const response = await fetch('/api/stacks/text-to-qr', {
      method: 'POST',
      body: JSON.stringify({ qrPrompt, url }),
    });
    const data = await response.json();
    setImg(data.img);
    setLoading(false);
  };

  return (
    <div className="stretch mx-auto flex w-5/6 flex-col items-center justify-center space-y-4 pb-10 md:w-3/4 lg:w-2/3">
      <div className="flex w-full flex-col items-center justify-center">
        {img ? (
          <img className="md:2/3 w-full sm:w-3/4 lg:w-1/2 xl:w-2/5" src={img} />
        ) : (
          <>
            <input
              type="text"
              disabled={loading}
              onChange={(e) => setUrl(e.target.value)}
              value={url}
              placeholder="Enter message or  website link..."
              className="mb-2 w-full rounded-lg border border-gray-300 p-2 pl-4 sm:w-3/4 md:w-1/2"
            />
            <textarea
              disabled={loading}
              onChange={(e) => setQrPrompt(e.target.value)}
              value={qrPrompt}
              placeholder="Enter qr code prompt..."
              className="mb-2 w-full resize-none rounded-lg border border-gray-300 p-2 pl-4 sm:w-3/4 md:w-1/2"
            />
          </>
        )}
      </div>

      <button
        onClick={createMusic}
        disabled={loading}
        className={`${
          loading && 'bg-black text-white'
        } rounded-md border border-black px-3 py-1 font-medium`}
      >
        {img ? 'Reset' : loading ? 'Loading, 5-10 secs...' : 'Create QR Code'}
      </button>
    </div>
  );
}
