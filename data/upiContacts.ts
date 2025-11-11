import type { UpiContact } from '../types';

const LOCAL_STORAGE_KEY = 'supermoney_upi_contacts';

const initialContacts: UpiContact[] = [
  { id: 'paytmqr5ebrzh@ptys', upiId: 'paytmqr5ebrzh@ptys', name: 'DEEPAK FARSHAN MART' },
  { id: 'vinitadubey063@okicici', upiId: 'vinitadubey063@okicici', name: 'Vinita' },
  { id: 'q479187664@ybl', upiId: 'q479187664@ybl', name: 'Ramesh Singh Paramar' },
  { id: 'paytm.s15nu2j@pty', upiId: 'paytm.s15nu2j@pty', name: 'Ganesan Sivasubramanian Konar' },
  { id: 'madinastores@srcb', upiId: 'madinastores@srcb', name: 'Madina Stores' },
  { id: 'pandiyans201700@tmb', upiId: 'pandiyans201700@tmb', name: 'Pandiyan' },
  { id: 'paytmqr6bl6sf@ptys', upiId: 'paytmqr6bl6sf@ptys', name: 'Pranshu Dwivedi' },
];

export const getUpiContacts = (): UpiContact[] => {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Basic validation to ensure it's an array of contacts
      if (Array.isArray(parsed) && parsed.every(item => 'id' in item && 'upiId' in item && 'name' in item)) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to parse UPI contacts from localStorage', e);
  }
  // If nothing in localStorage or data is invalid, set initial contacts
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialContacts));
  return initialContacts;
};

export const saveUpiContacts = (contacts: UpiContact[]) => {
  try {
    const contactsJson = JSON.stringify(contacts);
    localStorage.setItem(LOCAL_STORAGE_KEY, contactsJson);
    console.log(`Saved ${contacts.length} contacts to localStorage.`);
  } catch (e) {
    console.error('Failed to save UPI contacts to localStorage', e);
  }
};