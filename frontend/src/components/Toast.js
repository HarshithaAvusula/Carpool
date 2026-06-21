import React from 'react';

const Toast = ({ message, onClose }) => {
  return (
    <div className="max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden">
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-1">
            <p className="text-sm text-gray-900">{message}</p>
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              onClick={onClose}
              className="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              ✕
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Toast;
