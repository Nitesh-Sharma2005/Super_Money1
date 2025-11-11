import React from 'react';
import type { FeatureCardProps } from '../types';
import { ArrowRightIcon } from '../constants/icons';

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, buttonText, gradient }) => {
  return (
    <div className={`relative flex flex-col justify-between p-6 overflow-hidden text-white rounded-2xl shadow-lg h-56 ${gradient}`}>
      <div className="absolute top-0 right-0 w-32 h-32 text-white/10 -translate-y-4 translate-x-4">
        {/* Fix: Cast icon to React.ReactElement<{ className?: string }> to allow cloning with a className prop. */}
        {React.cloneElement(icon as React.ReactElement<{ className?: string }>, { className: 'w-full h-full' })}
      </div>
      <div className="relative z-10">
        <h3 className="text-2xl font-bold">{title}</h3>
        <p className="mt-1 text-sm text-white/80 max-w-xs">{description}</p>
      </div>
      <button className="relative z-10 self-start inline-flex items-center px-5 py-2 text-sm font-semibold text-gray-900 bg-white rounded-full group hover:bg-gray-200 transition-colors">
        {buttonText}
        <ArrowRightIcon className="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-1" />
      </button>
    </div>
  );
};

export default FeatureCard;
