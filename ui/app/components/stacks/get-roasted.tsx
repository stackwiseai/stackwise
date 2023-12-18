'use client';

import { useState } from 'react';
import { useChat } from 'ai/react';
import { IoSend } from 'react-icons/io5';

export default function Chat() {
  const [image, setImage] = useState(
    'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Field_sparrow_in_CP_%2841484%29_%28cropped%29.jpg/733px-Field_sparrow_in_CP_%2841484%29_%28cropped%29.jpg',
  );

  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: '/api/getImageDescriptionOpenAI',
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
    <div className="stretch mx-auto flex w-full flex-col items-center justify-center">
      <form
        onSubmit={(e) => {
          handleSubmit(e, {
            data: {
              imageUrl: image,
            },
          });
        }}
        className="flex w-3/4 flex-col items-center space-y-4 md:w-1/2 lg:w-2/5"
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="mr-2 w-24 cursor-pointer rounded-md border-2 border-dashed py-1 file:border-0 file:bg-transparent file:text-sm file:font-semibold md:w-auto"
        />
        {image && <img src={image} alt="Preview" className="mx-auto w-96" />}
        <div className="relative w-full">
          <input
            className="focus:shadow-outline w-full rounded-full border border-gray-400 py-2 pl-4 pr-10 focus:outline-none"
            value={input}
            placeholder="Ask a question..."
            onChange={handleInputChange}
          />
          <button
            type="submit"
            className={`focus:shadow-outline absolute right-0 top-0 h-full cursor-pointer rounded-r-full px-4 font-bold text-black focus:outline-none`}
          >
            <IoSend />
          </button>
        </div>
      </form>
      <div className="mt-2 w-3/4 md:w-1/2 lg:w-2/5">
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
