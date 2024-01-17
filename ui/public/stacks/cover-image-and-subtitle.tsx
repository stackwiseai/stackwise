'use client';

import { useState } from 'react';

export const GenerateImageAndSubtitle = () => {
  const [video, setVideo] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [imgUrl, setImgUrl] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (subtitle) {
      setSubtitle('');
    }
    if (imgUrl) {
      setImgUrl('');
    }
    if (e.target.files && e.target.files[0]) {
      setVideo(e.target.files[0]);
    }
  };

  const getSubtitle = async () => {
    try {
      if (loading || !video) {
        return;
      }

      if (subtitle || imgUrl) {
        setSubtitle('');
        setImgUrl('');
        return;
      }

      setLoading(true);
      const formData = new FormData();
      if (!video) return;
      formData.append('video', video);

      const response = await fetch('/api/cover-image-and-subtitle', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setSubtitle(data.subtitle);
      setImgUrl(data.imgUrl);
      setSummary(data.summarizedText);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const downloadSubtitle = () => {
    if (!subtitle) {
      console.error('Subtitle not Present !!');
      return;
    }

    const blob = new Blob([subtitle], { type: 'text/vtt' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'subtitle.vtt';

    document.body.appendChild(link);
    link.click();

    // Clean up the link
    document.body.removeChild(link);
  };

  return (
    <div className="stretch mx-auto flex w-5/6 flex-col items-center justify-center space-y-4 pb-10 md:w-3/4 lg:w-2/3">
      <div className="mt-2 flex items-center justify-center">
        <label
          htmlFor="customFileUpload"
          className="mr-4 flex w-full cursor-pointer items-center rounded-lg border-2 border-dashed py-1 pl-2 "
        >
          <span id="pdfLabel" className="mr-2 whitespace-nowrap">
            Upload Video
          </span>
          <input
            type="file"
            onChange={handleVideoUpload}
            disabled={loading}
            aria-labelledby="pdfLabel"
            accept="video/*"
            id="customFileUpload"
            className="hidden"
          />
          {video && (
            <div className="line-clamp-2 pr-2 text-gray-600">{video.name}</div>
          )}
        </label>
      </div>
      <div className="flex w-full flex-col items-center justify-center space-x-4 sm:flex-row">
        {video && (
          <video
            src={URL.createObjectURL(video)}
            className={`mx-auto w-1/2 ${loading && 'blur-sm'}`}
            controls
          />
        )}
        {subtitle && (
          <div className="mt-3 flex w-full flex-col items-center justify-center space-y-3 px-3 sm:mt-0 sm:w-1/2">
            <div className="text-sm">{imgUrl && <img src={imgUrl} />}</div>
            {summary && (
              <div className="mb-3 text-sm">
                <span className="font-medium">Summary of video:</span> {summary}
              </div>
            )}
            <div className="flex w-full flex-col justify-center space-y-2">
              <button
                className="mx-auto rounded-md border border-black px-3 py-1 font-medium xl:w-1/2"
                onClick={downloadSubtitle}
              >
                Download Subtitles
              </button>
              <div
                className="mx-auto flex cursor-pointer items-center justify-center space-x-2"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <svg
                  className={`h-4 w-4 ${isDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
                <span className="text-center text-sm font-medium">
                  {isDropdownOpen ? 'Hide Subtitles' : 'Show Subtitles'}
                </span>
              </div>

              <div
                className="w-full"
                style={{
                  maxHeight: isDropdownOpen ? '500px' : '0',
                  overflow: 'hidden',
                  transition: 'max-height 0.3s ease-in-out',
                }}
              >
                {isDropdownOpen && (
                  <div className="bg-gray-100 p-2 text-sm">
                    {subtitle || 'No Subtitles'}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      <button
        onClick={getSubtitle}
        disabled={loading}
        className={`${
          loading && 'bg-black text-white'
        } rounded-md border border-black px-3 py-1 font-medium`}
      >
        {subtitle ? 'Reset' : loading ? 'Loading, 2-3 mins...' : 'Create '}
      </button>
    </div>
  );
};

export default GenerateImageAndSubtitle;
