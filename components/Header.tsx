
import React from 'react';

interface HeaderProps {
  lastUpdated: Date | null;
  isConnected: boolean;
}

const Header: React.FC<HeaderProps> = ({ lastUpdated, isConnected }) => {
  return (
    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-gray-700">
      <div>
        <h1 className="text-3xl font-bold text-white">Hotel Pulse Dashboard</h1>
        <p className="text-sm text-gray-400 mt-1">
          Real-time overview of hotel operations and performance.
        </p>
      </div>
      <div className="flex items-center mt-4 sm:mt-0 text-sm">
        <div className={`w-3 h-3 rounded-full mr-2 ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
        <span className="text-gray-400">
          {isConnected ? 'Live' : 'Disconnected'}
        </span>
        {lastUpdated && (
          <span className="text-gray-500 ml-4">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </span>
        )}
      </div>
    </header>
  );
};

export default Header;
