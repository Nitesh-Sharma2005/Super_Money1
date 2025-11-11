import React, { useState, useEffect } from 'react';
import type { UpiContact } from '../../types';
import { ArrowLeftIcon, PlusIcon, PencilIcon, TrashIcon } from '../../constants/icons';

interface UpiContactsPageProps {
  contacts: UpiContact[];
  onBack: () => void;
  onAdd: (contact: { upiId: string; name: string }) => void;
  onUpdate: (contact: UpiContact) => void;
  onDelete: (id: string) => void;
}

const UpiContactsPage: React.FC<UpiContactsPageProps> = ({ contacts, onBack, onAdd, onUpdate, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<UpiContact | null>(null);
  const [formUpiId, setFormUpiId] = useState('');
  const [formName, setFormName] = useState('');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (editingContact) {
      setFormUpiId(editingContact.upiId);
      setFormName(editingContact.name);
    }
  }, [editingContact]);

  const openAddModal = () => {
    setEditingContact(null);
    setFormUpiId('');
    setFormName('');
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (contact: UpiContact) => {
    setEditingContact(contact);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingContact(null);
  };

  const handleSave = () => {
    if (!formUpiId.trim() || !formName.trim()) {
      setFormError('Both fields are required.');
      return;
    }
    if (!formUpiId.includes('@')) {
      setFormError('Please enter a valid UPI ID.');
      return;
    }
    
    if (editingContact) {
      onUpdate({ ...editingContact, upiId: formUpiId.trim(), name: formName.trim() });
    } else {
      onAdd({ upiId: formUpiId.trim(), name: formName.trim() });
    }
    closeModal();
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 font-sans">
      <header className="sticky top-0 z-10 flex items-center justify-between bg-gray-50/90 backdrop-blur-sm p-3 border-b border-gray-200">
        <button onClick={onBack} className="p-2 text-gray-500 rounded-full hover:bg-gray-200">
          <ArrowLeftIcon className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold text-gray-800">Manage UPI Contacts</h1>
        <button onClick={openAddModal} className="p-2 text-purple-500 rounded-full hover:bg-purple-100">
          <PlusIcon className="w-6 h-6" />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto">
        {contacts.length === 0 ? (
          <div className="text-center text-gray-500 pt-16">
            <p>No contacts saved.</p>
            <p className="text-sm">Click the '+' button to add one.</p>
          </div>
        ) : (
          <ul className="p-3 space-y-2">
            {contacts.map(contact => (
              <li key={contact.id} className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 truncate">{contact.name}</p>
                  <p className="text-sm text-gray-500 truncate">{contact.upiId}</p>
                </div>
                <div className="flex items-center space-x-1">
                  <button onClick={() => openEditModal(contact)} className="p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 rounded-full">
                    <PencilIcon className="w-5 h-5" />
                  </button>
                  <button onClick={() => { if(window.confirm('Are you sure you want to permanently delete this contact?')) onDelete(contact.id)}} className="p-2 text-gray-400 hover:bg-red-100 hover:text-red-500 rounded-full">
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>

      {isModalOpen && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-xl animate-fade-in-up">
            <h2 className="text-xl font-bold mb-4">{editingContact ? 'Edit Contact' : 'Add New Contact'}</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="upiId" className="text-sm font-medium text-gray-600">UPI ID</label>
                <input
                  id="upiId"
                  type="text"
                  value={formUpiId}
                  onChange={(e) => setFormUpiId(e.target.value)}
                  placeholder="example@bank"
                  className="mt-1 w-full p-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                  readOnly={!!editingContact} // Prevent editing UPI ID as it's the key
                />
              </div>
              <div>
                <label htmlFor="name" className="text-sm font-medium text-gray-600">Payee Name</label>
                <input
                  id="name"
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="John Doe"
                  className="mt-1 w-full p-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                  autoFocus
                />
              </div>
            </div>
            {formError && <p className="text-red-500 text-sm mt-3">{formError}</p>}
            <div className="flex items-center space-x-2 pt-6">
              <button onClick={closeModal} className="w-full py-3 text-lg font-semibold bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">
                Cancel
              </button>
              <button onClick={handleSave} className="w-full py-3 text-lg font-semibold bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                Save
              </button>
            </div>
          </div>
           <style>{`
              @keyframes fade-in-up {
                from { opacity: 0; transform: translateY(20px) scale(0.95); }
                to { opacity: 1; transform: translateY(0) scale(1); }
              }
              .animate-fade-in-up { animation: fade-in-up 0.3s ease-out; }
            `}</style>
        </div>
      )}
    </div>
  );
};

export default UpiContactsPage;