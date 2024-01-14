'use client'

import { useState } from 'react';

export const GenerateImageAndSubtitle = () => {

  const [video,setVideo] = useState<File|null>(null);
  const [loading,setLoading] = useState(false);
  const [subtitle,setSubtitle] = useState("");
  const [imgUrl,setImgUrl] = useState("");

  return (

    <div className="stretch mx-auto flex w-5/6 flex-col items-center justify-center space-y-4 pb-10 md:w-3/4 lg:w-2/3">
      <div className="flex items-center justify-center mt-2">
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
    <div className="flex w-full items-center justify-center space-x-4">
      {video && (
        <video
          src={URL.createObjectURL(video)}
          className={`mx-auto w-1/2 ${loading && 'blur-sm'}`}
          controls
        />
      )}
      {subtitle && (
        <div className="w-1/2 space-y-3 px-6">

          <div className="mb-3 text-sm">
            {imgUrl && <img src={imgUrl} />}
            <div className="text-zinc-500">
              Generated Image
            </div>
          </div>
          

          <div>
            <button 
              className="rounded-md border border-black px-3 py-1 font-medium"
              onClick={()=>downloadSubtitle()}>
              Download Subtitle
            </button>
            <div className="text-sm text-clip text-zinc-500 mt-2">
              Click the download button to start downloading the subtitle
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
      {subtitle
        ? 'Reset'
        : loading
          ? 'Loading, 2-3 mins...'
          : 'Create '}
    </button>
  </div>

  )
};

export default GenerateImageAndSubtitle;
