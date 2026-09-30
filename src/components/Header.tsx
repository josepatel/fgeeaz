import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white/80 backdrop-blur-sm fixed top-0 left-0 right-0 z-50 border-b border-gray-100">
      <div className="flex items-center justify-center px-4 py-3">
        <a href="/"><img src="/logo-sg.svg" alt="Société Générale" className="h-10 md:h-12" /></a>
      </div>
    </header>
  );
};

export default Header;
