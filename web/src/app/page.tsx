"use client";

import { Chat } from './Chat';
import Home from './Home'; // Adjust the path to where your Home.tsx is located

// Define the WrapperComponent directly in the page.tsx file
const WrapperComponent = ({ children }) => {
  return <div className="wrapper">{children}</div>;
};

const WrappedHome = () => {
  return (
    <WrapperComponent>
      <Home />
      <Chat />
    </WrapperComponent>
  );
};

export default WrappedHome;
