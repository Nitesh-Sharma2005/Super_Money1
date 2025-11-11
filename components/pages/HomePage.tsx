import React from 'react';
import Header from '../Header';
import FeatureCard from '../FeatureCard';
import type { FeatureCardProps, SmallCardProps } from '../../types';
import { CreditCardIcon, PiggyBankIcon, ChevronRightIcon } from '../../constants/icons';

const mainFeatures: FeatureCardProps[] = [
  {
    icon: <CreditCardIcon />,
    title: 'Build Credit',
    description: 'The easiest way to build your credit score.',
    buttonText: 'Get Started',
    gradient: 'from-purple-500 to-pink-600',
  },
];

const smallCards: SmallCardProps[] = [
    { icon: <PiggyBankIcon className="w-6 h-6 text-green-400" />, title: 'Cash Back', value: '$12.50' },
    { icon: <CreditCardIcon className="w-6 h-6 text-blue-400" />, title: 'Credit Score', value: '750' },
    { icon: <PiggyBankIcon className="w-6 h-6 text-indigo-400" />, title: 'Savings Goal', value: '$5,000' },
];

const SmallCard: React.FC<SmallCardProps> = ({ icon, title, value }) => (
    <div className="flex items-center p-3 space-x-3 bg-white rounded-xl shadow-sm">
        <div className="p-2 bg-gray-100 rounded-lg">
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-500">{title}</p>
            <p className="font-bold text-gray-900">{value}</p>
        </div>
    </div>
);

interface HomePageProps {
  name: string;
  profileImage: string;
}

const HomePage: React.FC<HomePageProps> = ({ name, profileImage }) => {
  return (
    <>
      <Header name={name} profileImage={profileImage} />
      <div className="p-4 space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {smallCards.map(card => <SmallCard key={card.title} {...card} />)}
        </div>
        
        <div className="space-y-4">
          {mainFeatures.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>

        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-3">Quick Actions</h2>
          <div className="space-y-3">
              <ActionItem title="Pay with Super" subtitle="Earn 5% cash back" />
              <ActionItem title="Refer a Friend" subtitle="Get $20 for each referral" />
              <ActionItem title="See All Deals" subtitle="Explore exclusive offers" />
          </div>
        </div>
      </div>
    </>
  );
};

const ActionItem: React.FC<{title: string, subtitle: string}> = ({ title, subtitle }) => (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors cursor-pointer">
        <div>
            <p className="font-semibold text-gray-900">{title}</p>
            <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
        <ChevronRightIcon className="w-5 h-5 text-gray-400" />
    </div>
);


export default HomePage;
