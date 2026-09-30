import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[100] bg-white flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-sg-red rounded-full animate-spin"></div>
        <p className="mt-4 text-sm text-gray-500">Chargement...</p>
      </div>
    </div>
  );
};

export default Loader;
