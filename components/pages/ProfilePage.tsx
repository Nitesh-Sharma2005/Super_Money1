import React, { useState, useRef } from 'react';
import {
  ChevronRightIcon,
  MapPinIcon,
  LanguageIcon,
  CreditCardIcon,
  GlobeAltIcon,
  BanknotesIcon,
  ShieldCheckIcon,
  LockClosedIcon,
  CogIcon,
  HelpIcon,
  ChatBubbleLeftRightIcon,
  ArrowRightOnRectangleIcon,
  CameraIcon,
  UserCircleIcon,
  TrashIcon,
  UserGroupIcon,
} from '../../constants/icons';
import type { UpiContact } from '../../types';
import UpiContactsPage from './UpiContactsPage';

interface ProfilePageProps {
  name: string;
  phone: string;
  profileImage: string;
  onProfileUpdate: (details: { name?: string; phone?: string; image?: string }) => void;
  onClearAllTransactions: () => void;
  upiContacts: UpiContact[];
  onAddUpiContact: (contact: { upiId: string; name: string }) => void;
  onUpdateUpiContact: (contact: UpiContact) => void;
  onDeleteUpiContact: (id: string) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ 
  name, phone, profileImage, onProfileUpdate, onClearAllTransactions, 
  upiContacts, onAddUpiContact, onUpdateUpiContact, onDeleteUpiContact 
}) => {
  const [view, setView] = useState<'main' | 'upiContacts'>('main');
  const [isEditing, setIsEditing] = useState(false);
  // State for the input fields
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    const updatePayload: { name?: string; phone?: string; image?: string } = {};
    
    const newName = editName.trim();
    if (newName) updatePayload.name = newName;
    
    const newPhone = editPhone.trim();
    if (newPhone) updatePayload.phone = newPhone;
    
    if (editImagePreview) updatePayload.image = editImagePreview;

    if (Object.keys(updatePayload).length > 0) {
      onProfileUpdate(updatePayload);
    }
    
    // Clear the form after saving
    setEditName('');
    setEditPhone('');
    setEditImagePreview(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditName('');
    setEditPhone('');
    setEditImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setIsEditing(false);
  };

  if (view === 'upiContacts') {
    return (
      <UpiContactsPage
        contacts={upiContacts}
        onBack={() => setView('main')}
        onAdd={onAddUpiContact}
        onUpdate={onUpdateUpiContact}
        onDelete={onDeleteUpiContact}
      />
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50 text-gray-900 font-sans">
      {/* Top Profile Card */}
      <div className="flex flex-col items-center p-6 space-y-3 bg-white">
        <img
          src={profileImage}
          alt="User Avatar"
          className="w-24 h-24 rounded-full border-4 border-purple-500 object-cover"
        />
        <div>
          <h1 className="text-2xl font-bold text-center">{name}</h1>
          <p className="text-gray-500 text-center">{phone}</p>
        </div>
      </div>

      {/* Scrollable list of settings */}
      <main className="flex-1 overflow-y-auto p-4 no-scrollbar">
        <SettingsSection title="Personal Details">
          {isEditing ? (
            <div className="p-4 space-y-4">
              <div className="flex flex-col items-center space-y-3">
                <div className="relative">
                  <img
                    src={editImagePreview || profileImage}
                    alt="Profile Preview"
                    className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 p-2 bg-purple-600 rounded-full text-white hover:bg-purple-700 transition-colors"
                    aria-label="Upload new profile picture"
                  >
                    <CameraIcon className="w-5 h-5" />
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="name" className="text-sm font-medium text-gray-500">Full Name</label>
                <input
                  id="name"
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Enter your name"
                  className="mt-1 w-full p-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                />
              </div>

              <div>
                <label htmlFor="phone" className="text-sm font-medium text-gray-500">Phone Number</label>
                <input
                  id="phone"
                  type="text"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  placeholder="Enter your phone number"
                  className="mt-1 w-full p-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                />
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <button
                  onClick={handleCancel}
                  className="w-full py-3 text-lg font-semibold bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all duration-300 transform active:scale-95"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="w-full py-3 text-lg font-semibold bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-200 disabled:text-gray-400 transition-all duration-300 transform active:scale-95"
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <SettingsItem
              icon={<UserCircleIcon className="w-6 h-6 text-purple-400" />}
              text="Edit Personal Details"
              onClick={() => setIsEditing(true)}
            />
          )}
        </SettingsSection>
        
        <SettingsSection title="Account Settings">
          <SettingsItem icon={<MapPinIcon className="w-6 h-6 text-purple-400" />} text="Saved Addresses" />
          <SettingsItem icon={<LanguageIcon className="w-6 h-6 text-purple-400" />} text="Language" />
        </SettingsSection>
        
        <SettingsSection title="Payment Settings">
          <SettingsItem icon={<CreditCardIcon className="w-6 h-6 text-green-400" />} text="Saved Cards" />
          <SettingsItem icon={<GlobeAltIcon className="w-6 h-6 text-green-400" />} text="UPI Settings" />
          <SettingsItem icon={<BanknotesIcon className="w-6 h-6 text-green-400" />} text="Autopay" />
        </SettingsSection>
        
        <SettingsSection title="Security">
          <SettingsItem icon={<ShieldCheckIcon className="w-6 h-6 text-blue-400" />} text="Change PIN" />
          <SettingsItem icon={<LockClosedIcon className="w-6 h-6 text-blue-400" />} text="App Lock" />
          <SettingsItem icon={<CogIcon className="w-6 h-6 text-blue-400" />} text="Permissions" />
        </SettingsSection>

        <SettingsSection title="Help & Support">
          <SettingsItem icon={<HelpIcon className="w-6 h-6 text-yellow-400" />} text="FAQs" />
          <SettingsItem icon={<ChatBubbleLeftRightIcon className="w-6 h-6 text-yellow-400" />} text="Contact Us" />
        </SettingsSection>

        <SettingsSection title="Data Management">
            <SettingsItem
                icon={<UserGroupIcon className="w-6 h-6 text-purple-400" />}
                text="Manage UPI Contacts"
                onClick={() => setView('upiContacts')}
            />
            <button
              onClick={onClearAllTransactions}
              className="w-full flex items-center justify-between p-4 text-left text-red-600 transition-colors hover:bg-red-50 last:border-b-0 first:rounded-t-lg last:rounded-b-lg group"
            >
              <div className="flex items-center">
                <TrashIcon className="w-6 h-6 text-red-400" />
                <span className="ml-4 font-semibold">Clear Transaction History</span>
              </div>
            </button>
        </SettingsSection>

        <div className="mt-6">
          <button className="w-full flex items-center justify-center p-3 text-red-500 bg-white rounded-lg hover:bg-red-50/50 transition-colors shadow-sm">
            <ArrowRightOnRectangleIcon className="w-6 h-6 mr-3" />
            <span className="font-semibold">Logout</span>
          </button>
        </div>
      </main>
    </div>
  );
};

const SettingsSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mb-6">
    <h2 className="px-4 pb-2 text-sm font-semibold text-gray-400 uppercase">{title}</h2>
    <div className="bg-white rounded-lg shadow-sm">
      {children}
    </div>
  </div>
);

const SettingsItem: React.FC<{ icon: React.ReactNode; text: string; onClick?: () => void }> = ({ icon, text, onClick }) => (
  <button onClick={onClick} className="w-full flex items-center justify-between p-4 text-left transition-colors hover:bg-gray-50 border-b border-gray-200/75 last:border-b-0 first:rounded-t-lg last:rounded-b-lg group disabled:cursor-not-allowed">
    <div className="flex items-center">
      {icon}
      <span className="ml-4 font-medium">{text}</span>
    </div>
    <ChevronRightIcon className="w-5 h-5 text-gray-400 transition-transform group-hover:translate-x-1" />
  </button>
);

export default ProfilePage;
