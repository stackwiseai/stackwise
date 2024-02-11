'use client';

import { useState } from 'react';
import tw from 'tailwind-styled-components';

const glowingShadowStyle = {
  boxShadow: `0 0 10px rgba(0, 0, 0, 0.6), 
                0 0 20px rgba(0, 0, 0, 0.4), 
                0 0 30px rgba(0, 0, 0, 0.2)`,
};

const glowingShadowHoverStyle = {
  boxShadow: `0 0 10px rgba(0, 0, 0, 0.7), 
              0 0 20px rgba(0, 0, 0, 0.5), 
              0 0 30px rgba(0, 0, 0, 0.3), 
              0 0 40px rgba(0, 0, 0, 0.1)`,
};

const ContactButton: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Button
      style={isHovered ? glowingShadowHoverStyle : glowingShadowStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      Contact Us
    </Button>
  );
};

export default ContactButton;

const Button = tw.button`
  bg-black
  text-white
  font-bold
  py-2
  px-4
  rounded-full
  absolute
  top-4
  right-4
  transition duration-300 ease-in-out
`;
