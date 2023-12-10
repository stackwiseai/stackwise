import { IoSend } from 'react-icons/io5';

interface SubmitFormProps {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  inputValue: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  loading: boolean;
  generatedFileContents: string;
}

const SubmitForm: React.FC<SubmitFormProps> = ({
  handleSubmit,
  inputValue,
  setInputValue,
  loading,
  generatedFileContents,
}) => {
  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col w-full">
        <div className="relative w-full">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask anything..."
            className="rounded-full w-full py-2 pl-4 pr-10 border border-gray-400 focus:outline-none focus:shadow-outline"
            onKeyDown={(e) => {
              if (e.key === 'Enter')
                handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
            }}
          />
          <button
            type="submit"
            className={`cursor-pointer absolute right-0 top-0 rounded-r-full h-full text-black font-bold px-4 focus:outline-none focus:shadow-outline ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={loading}
          >
            <IoSend />
          </button>
        </div>
      </form>
      <div className="mt-4 min-h-4 p-4 w-full overflow-auto rounded-md bg-[#faf0e6]">
        {loading ? (
          <span className="text-sm text-gray-400">Generating... </span>
        ) : generatedFileContents ? (
          generatedFileContents
        ) : (
          <p className="text-gray-400 text-sm">Output here...</p>
        )}
      </div>
    </>
  );
};

export default SubmitForm;
