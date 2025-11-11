import React from 'react';
import { NavTab } from '../types';
import { HomeIcon, QrCodeIcon, ProfileIcon } from '../constants/icons';

interface BottomNavProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
}

const navItems = [
  { tab: NavTab.Home, icon: HomeIcon, label: 'Home' },
  { tab: NavTab.Pay, icon: QrCodeIcon, label: 'Pay' },
  { tab: NavTab.Profile, icon: ProfileIcon, label: 'Profile' },
];

const NavItem: React.FC<{
  item: typeof navItems[0];
  isActive: boolean;
  onClick: () => void;
}> = ({ item, isActive, onClick }) => {
  const activeClasses = 'text-purple-500';
  const inactiveClasses = 'text-gray-400';

  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center w-full pt-2 pb-1 transition-colors duration-200 ease-in-out ${isActive ? activeClasses : inactiveClasses} hover:text-purple-500`}
    >
      <item.icon className="w-6 h-6 mb-1" />
      <span className="text-xs font-medium">{item.label}</span>
      {isActive && <div className="w-8 h-1 bg-purple-500 rounded-full mt-1"></div>}
    </button>
  );
};

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-10 h-20 bg-white/80 backdrop-blur-sm border-t border-gray-200">
      <div className="flex items-center justify-around h-full max-w-md mx-auto">
        {navItems.map((item) => (
          <NavItem
            key={item.tab}
            item={item}
            isActive={activeTab === item.tab}
            onClick={() => setActiveTab(item.tab)}
          />
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
