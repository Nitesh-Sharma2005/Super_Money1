import React from 'react';
import { BellIcon } from '../constants/icons';

interface HeaderProps {
  name: string;
  profileImage: string;
}

const Header: React.FC<HeaderProps> = ({ name, profileImage }) => {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm border-b border-gray-200">
      <div className="flex items-center space-x-3">
        <img
          src={profileImage}
          alt="User Avatar"
          className="w-10 h-10 rounded-full border-2 border-purple-500 object-cover"
        />
        <div>
          <p className="text-sm text-gray-500">Good morning</p>
          <h1 className="text-lg font-bold text-gray-900">{name}</h1>
        </div>
      </div>
      <button className="relative p-2 text-gray-500 rounded-full hover:bg-gray-100 hover:text-gray-800 transition-colors">
        <BellIcon className="w-6 h-6" />
        <span className="absolute top-2 right-2 flex h-2 w-2">
          <span className="absolute inline-flex w-full h-full bg-red-400 rounded-full opacity-75 animate-ping"></span>
          <span className="relative inline-flex w-2 h-2 bg-red-500 rounded-full"></span>
        </span>
      </button>
    </header>
  );
};

export default Header;
