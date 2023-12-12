import Link from 'next/link';

export const ContactStackwise: React.FC = () => {
  return (
    <Link
      className="cursor-pointer absolute sm:fixed -top-3 left-2 sm:top-auto sm:bottom-4 sm:left-4 pr-20"
      href="https://twitter.com/stackwiseai"
    >
      Get the component you need by <b>tweeting @stackwise_ai</b>
    </Link>
  );
};

export default ContactStackwise;
