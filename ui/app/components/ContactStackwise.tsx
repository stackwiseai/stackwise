import Link from 'next/link';

export const ContactStackwise: React.FC = () => {
  return (
    <Link
      className="cursor-pointer fixed bottom-4 left-4"
      href="https://twitter.com/stackwiseai"
    >
      Get the component you need by <b>tweeting @stackwise_ai</b>
    </Link>
  );
};

export default ContactStackwise;
