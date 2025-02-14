import React from 'react';

const Logoloader = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] bg-blue-50">
      <div className="animate-spin mb-4">
        <svg
          viewBox="0 0 100 100"
          className="w-40 h-40"
        >
          <path
            d="M 50,10
               A 40,40 0 1,1 10,50
               A 40,40 0 0,0 90,50"
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="12"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="gradient" gradientTransform="rotate(90)">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="50%" stopColor="#EC4899" />
              <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className="text-center">
        <h2 className="text-xl font-semibold text-purple-600 mb-2">Detecting....</h2>
        <p className="text-gray-600">Please Wait</p>
      </div>
    </div>
  );
};

export default Logoloader;