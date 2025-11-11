import React, { useState, useCallback } from 'react';
import BottomNav from './components/BottomNav';
import HomePage from './components/pages/HomePage';
import ProfilePage from './components/pages/ProfilePage';
import PayPage from './components/pages/PayPage';
import { NavTab, Transaction, UpiContact } from './types';
import { getUpiContacts, saveUpiContacts } from './data/upiContacts';

// Local storage keys
const LOCAL_STORAGE_KEYS = {
  NAME: 'supermoney_profile_name',
  PHONE: 'supermoney_profile_phone',
  IMAGE: 'supermoney_profile_image',
  TRANSACTIONS: 'supermoney_transactions',
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavTab>(NavTab.Home);

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.TRANSACTIONS);
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed)
        ? parsed.map((tx: any) => ({ ...tx, timestamp: new Date(tx.timestamp) }))
        : [];
    } catch (e) {
      console.error('Failed to parse transactions from localStorage', e);
      return [];
    }
  });
  
  const [upiContacts, setUpiContacts] = useState<UpiContact[]>(getUpiContacts);

  const [name, setName] = useState(() => localStorage.getItem(LOCAL_STORAGE_KEYS.NAME) || 'Guest');
  const [phone, setPhone] = useState(() => localStorage.getItem(LOCAL_STORAGE_KEYS.PHONE) || '+91 XXXXXXXX');
  const [profileImage, setProfileImage] = useState(
    () => localStorage.getItem(LOCAL_STORAGE_KEYS.IMAGE) || 'https://picsum.photos/seed/user/80/80'
  );

  const handleAddTransaction = useCallback((transaction: Transaction) => {
    setTransactions(prev => {
      const newTransactions = [transaction, ...prev].slice(0, 5);
      localStorage.setItem(LOCAL_STORAGE_KEYS.TRANSACTIONS, JSON.stringify(newTransactions));
      return newTransactions;
    });
  }, []);

  const handleDeleteTransaction = useCallback((id: string) => {
    setTransactions(prev => {
      const newTransactions = prev.filter(tx => tx.id !== id);
      localStorage.setItem(LOCAL_STORAGE_KEYS.TRANSACTIONS, JSON.stringify(newTransactions));
      return newTransactions;
    });
  }, []);

  const handleDeleteMultipleTransactions = useCallback((ids: string[]) => {
    const idsToDelete = new Set(ids);
    setTransactions(prev => {
      const newTransactions = prev.filter(tx => !idsToDelete.has(tx.id));
      localStorage.setItem(LOCAL_STORAGE_KEYS.TRANSACTIONS, JSON.stringify(newTransactions));
      return newTransactions;
    });
  }, []);

  const handleClearAllTransactions = useCallback(() => {
    if (window.confirm('Are you sure you want to clear all transaction history? This action cannot be undone.')) {
      localStorage.removeItem(LOCAL_STORAGE_KEYS.TRANSACTIONS);
      setTransactions([]);
    }
  }, []);

  const handleProfileUpdate = useCallback((details: { name?: string; phone?: string; image?: string }) => {
    const { name: newName, phone: newPhone, image: newImage } = details;
    if (newName) {
      setName(newName);
      localStorage.setItem(LOCAL_STORAGE_KEYS.NAME, newName);
    }
    if (newPhone) {
      setPhone(newPhone);
      localStorage.setItem(LOCAL_STORAGE_KEYS.PHONE, newPhone);
    }
    if (newImage) {
      setProfileImage(newImage);
      localStorage.setItem(LOCAL_STORAGE_KEYS.IMAGE, newImage);
    }
  }, []);
  
  const handleAddUpiContact = useCallback((contact: { upiId: string; name: string; }) => {
    setUpiContacts(prev => {
      const newContact: UpiContact = { ...contact, id: contact.upiId };
      if (prev.some(c => c.id.toLowerCase() === newContact.id.toLowerCase())) {
        alert('UPI ID already exists.');
        return prev;
      }
      const newContacts = [newContact, ...prev];
      saveUpiContacts(newContacts);
      return newContacts;
    });
  }, []);

  const handleUpdateUpiContact = useCallback((updatedContact: UpiContact) => {
    setUpiContacts(prev => {
      const newContacts = prev.map(c => c.id === updatedContact.id ? updatedContact : c);
      saveUpiContacts(newContacts);
      return newContacts;
    });
  }, []);

  const handleDeleteUpiContact = useCallback((id: string) => {
    setUpiContacts(prev => {
      const newContacts = prev.filter(c => c.id !== id);
      saveUpiContacts(newContacts);
      return newContacts;
    });
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case NavTab.Home:
        return <HomePage name={name} profileImage={profileImage} />;
      case NavTab.Pay:
        return (
          <PayPage
            upiContacts={upiContacts}
            transactions={transactions}
            onAddTransaction={handleAddTransaction}
            onDeleteTransaction={handleDeleteTransaction}
            onDeleteMultipleTransactions={handleDeleteMultipleTransactions}
            onClearAllTransactions={handleClearAllTransactions}
          />
        );
      case NavTab.Profile:
        return (
          <ProfilePage
            name={name}
            phone={phone}
            profileImage={profileImage}
            onProfileUpdate={handleProfileUpdate}
            onClearAllTransactions={handleClearAllTransactions}
            upiContacts={upiContacts}
            onAddUpiContact={handleAddUpiContact}
            onUpdateUpiContact={handleUpdateUpiContact}
            onDeleteUpiContact={handleDeleteUpiContact}
          />
        );
      default:
        return <HomePage name={name} profileImage={profileImage} />;
    }
  };

  return (
    <div className="w-full max-w-md mx-auto h-screen bg-gray-50 text-gray-900 font-sans relative">
      <main className="h-full overflow-y-auto pb-20 no-scrollbar">{renderContent()}</main>
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default App;
