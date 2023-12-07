'use client';
import React from 'react';
import Home from './Home'; // Adjust the path to where your Home.tsx is located
import { Chat } from './Chat';

const WrapperComponent = ({ children }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        height: '100vh', // Set the height to 100% of the viewport height
      }}
    >
      {children}
    </div>
  );
};

const WrappedHome = () => {
  return (
    <WrapperComponent>
      <div style={{ flex: 10, height: '100%' }}>
        <Home />
      </div>
      <div style={{ flex: 2, height: '100%' }}>
        <Chat />
      </div>
    </WrapperComponent>
  );
};

export default WrappedHome;
