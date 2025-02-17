import React from 'react';
import { X } from 'lucide-react';
const Card = ({ title, description, imageUrl, tags, setShowModel, handleDownloadReport}) => {

  const handleDownload = () => {
    // Handle download logic here
  }

  const handleNewDetection = () => {
    // Handle chat icon click (e.g., open chat UI)
    setShowModel(false);
  }

  return (
    <>
      <div className="bg-primary-400 p-4 rounded-2xl min-w-[800px] max-h-[90vh] w-full relative">

        {/* Chat Icon - Positioned Top-Right */}
        <div
          className="absolute flex top-4 right-4 p-2 rounded-full bg-secondary cursor-pointer"
          onClick={handleNewDetection}
        >
          <X className="w-5 h-5 text-white" />
        </div>

        <div className="flex gap-10 p-7 w-full">
          {/* Left side - Image and Report button */}
          <div className="flex-shrink-0 flex flex-col gap-4">
            <div className="max-w-90 max-h-100 overflow-hidden rounded-lg mt-10">
              <img
                src={imageUrl}
                alt="Psoriasis condition"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex justify-center">
              <button
                className="bg-secondary w-40 text-white px-2 py-2 rounded-full flex items-center justify-center space-x-2"
                onClick={handleDownloadReport}
              >
                <span>Report</span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Right side - Content */}
          <div className="flex-1 flex flex-col">
            <h2 className="text-2xl font-bold mb-4">{title} Detected</h2>

            <p className="text-gray-800 text-lg leading-relaxed flex-grow text-left">
              {description}
            </p>

            <div className="flex space-x-2 mt-4">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-orange-300 text-gray-800 px-4 py-2 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Card;
