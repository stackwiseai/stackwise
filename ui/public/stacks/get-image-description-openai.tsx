'use client';

import { useChat } from 'ai/react';
import { useState } from 'react';
import { IoSend } from 'react-icons/io5';

export default function Chat() {
  const [image, setImage] = useState(
    'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Field_sparrow_in_CP_%2841484%29_%28cropped%29.jpg/733px-Field_sparrow_in_CP_%2841484%29_%28cropped%29.jpg'
  );

  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: '/api/get-image-description-openai',
  });

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImage(reader.result);
        } else {
          // Handle the case where the result is not a string
          console.error('File could not be converted to base64 string');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex-col w-full mx-auto stretch flex justify-center items-center">
      <form
        onSubmit={(e) => {
          handleSubmit(e, {
            data: {
              imageUrl: image,
            },
          });
        }}
        className="flex flex-col items-center w-3/4 md:w-1/2 lg:w-2/5 space-y-4"
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-24 md:w-auto py-1 mr-2 cursor-pointer border-dashed border-2 rounded-md file:border-0 file:bg-transparent file:text-sm file:font-semibold"
        />
        {image && <img src={image} alt="Preview" className="w-96 mx-auto" />}
        <div className="relative w-full">
          <input
            className="rounded-full w-full py-2 pl-4 pr-10 border border-gray-400 focus:outline-none focus:shadow-outline"
            value={input}
            placeholder="Ask a question..."
            onChange={handleInputChange}
          />
          <button
            type="submit"
            className={`cursor-pointer absolute right-0 top-0 rounded-r-full h-full text-black font-bold px-4 focus:outline-none focus:shadow-outline`}
          >
            <IoSend />
          </button>
        </div>
      </form>
      <div className="w-3/4 md:w-1/2 lg:w-2/5 mt-2">
        {messages.length > 0
          ? messages.map((m) => (
              <div key={m.id} className="whitespace-pre-wrap">
                {m.role === 'user' ? 'User: ' : 'AI: '}
                {m.content}
              </div>
            ))
          : null}
      </div>
    </div>
  );
}
