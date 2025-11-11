import React, { useState, useMemo } from 'react';
import type { Transaction } from '../../types';
import { ArrowLeftIcon, SearchIcon, CashbackIcon } from '../../constants/icons';

interface TransactionHistoryPageProps {
  transactions: Transaction[];
  onBack: () => void;
  onTransactionClick: (transaction: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
  onDeleteMultipleTransactions: (ids: string[]) => void;
  onClearAllTransactions: () => void;
}

const TrashIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const CheckboxIcon = ({ checked }: { checked: boolean }) => (
  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${checked ? 'bg-purple-500 border-purple-500' : 'border-gray-300'}`}>
    {checked && (
      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    )}
  </div>
);

const colors = ['bg-pink-500', 'bg-blue-500', 'bg-indigo-500', 'bg-purple-500', 'bg-orange-500', 'bg-green-500', 'bg-yellow-500'];
const getAvatarColor = (char: string) => {
  const charCode = char.toUpperCase().charCodeAt(0);
  return colors[charCode % colors.length];
};

const formatDateForItem = (date: Date) => {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: '2-digit',
  }).format(date).replace(' 20', " '");
};

const TransactionItem: React.FC<{
  transaction: Transaction;
  onView: () => void;
  onDelete: () => void;
  isEditMode: boolean;
  isSelected: boolean;
  onSelect: () => void;
}> = ({ transaction, onView, onDelete, isEditMode, isSelected, onSelect }) => {
  const avatarColor = getAvatarColor(transaction.payee.name[0] || 'S');
  const initial = (transaction.payee.name[0] || 'S').toUpperCase();

  const handleMainClick = () => {
    if (isEditMode) {
      onSelect();
    } else {
      onView();
    }
  };

  return (
    <li
      className={`flex items-center p-3 bg-white rounded-lg shadow-sm transition-all duration-200 ${isSelected ? 'bg-purple-50' : 'hover:bg-gray-50'}`}
    >
      {isEditMode && (
        <div className="mr-3 flex-shrink-0 cursor-pointer" onClick={onSelect}>
          <CheckboxIcon checked={isSelected} />
        </div>
      )}
      
      {/* Main clickable area for viewing/selecting */}
      <div onClick={handleMainClick} className="flex items-center min-w-0 flex-1 cursor-pointer group">
        <div className={`w-10 h-10 rounded-md flex-shrink-0 flex items-center justify-center font-bold text-white text-xl mr-3 ${avatarColor}`}>
          {initial}
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-gray-800 truncate text-sm group-hover:text-purple-600">{transaction.payee.name}</p>
          <p className="text-xs text-gray-500">{formatDateForItem(new Date(transaction.timestamp))}</p>
        </div>
      </div>
      
      {/* Non-clickable area with amount and the separate delete button */}
      <div className="flex items-center flex-shrink-0 ml-2">
        <div className="text-right mr-2">
          <p className="font-bold text-sm text-gray-800">₹{transaction.amount.toFixed(0)}</p>
          <div className="flex items-center justify-end text-xs text-green-600 mt-1">
            <CashbackIcon className="w-3.5 h-3.5 mr-1" />
            <span className="font-semibold">{transaction.cashbackPercentage.toFixed(2)}%</span>
          </div>
        </div>
        {!isEditMode && (
          <button
            onClick={onDelete}
            className="p-2 -mr-1 text-gray-400 hover:bg-red-100 hover:text-red-500 rounded-full transition-colors"
            aria-label={`Delete transaction to ${transaction.payee.name}`}
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        )}
      </div>
    </li>
  );
};


const TransactionHistoryPage: React.FC<TransactionHistoryPageProps> = ({ transactions, onBack, onTransactionClick, onDeleteTransaction, onDeleteMultipleTransactions, onClearAllTransactions }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedTxIds, setSelectedTxIds] = useState<Set<string>>(new Set());

  const filteredAndGroupedTransactions = useMemo(() => {
    const filtered = transactions.filter(tx =>
      tx.payee.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return filtered.reduce((acc, tx) => {
      const monthYear = new Intl.DateTimeFormat('en-US', { month: 'long', year: '2-digit' }).format(new Date(tx.timestamp));
      if (!acc[monthYear]) {
        acc[monthYear] = [];
      }
      acc[monthYear].push(tx);
      return acc;
    }, {} as Record<string, Transaction[]>);
  }, [transactions, searchQuery]);
  
  const hasTransactions = transactions.length > 0;
  const hasResults = Object.keys(filteredAndGroupedTransactions).length > 0;

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
    setSelectedTxIds(new Set()); // Reset selection when toggling mode
  };

  const handleSelectTransaction = (id: string) => {
    setSelectedTxIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleBulkDelete = () => {
    if (selectedTxIds.size === 0) return;
    if (window.confirm(`Are you sure you want to delete ${selectedTxIds.size} transaction(s)?`)) {
      onDeleteMultipleTransactions(Array.from(selectedTxIds));
      toggleEditMode(); // Exit edit mode after deletion
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 font-sans">
      <header className="sticky top-0 z-10 bg-gray-50/90 backdrop-blur-sm p-3 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <button onClick={onBack} className="p-2 text-gray-500 rounded-full hover:bg-gray-200">
            <ArrowLeftIcon className="w-6 h-6" />
          </button>
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by name or number"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm text-black"
            />
          </div>
          {hasTransactions && !isEditMode && (
            <button
                onClick={onClearAllTransactions}
                className="px-3 py-2 border border-red-300 rounded-lg text-red-700 font-semibold text-sm bg-red-50 hover:bg-red-100 transition-colors flex-shrink-0"
            >
                Clear All
            </button>
          )}
          {hasTransactions && (
            <button onClick={toggleEditMode} className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold text-sm bg-white hover:bg-gray-100 transition-colors flex-shrink-0">
                {isEditMode ? 'Cancel' : 'Edit'}
            </button>
          )}
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">
        {!hasTransactions ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-500 p-8">
            <h3 className="text-lg font-semibold text-gray-700">History is Empty</h3>
            <p className="text-sm">Make your first payment to see it here.</p>
          </div>
        ) : !hasResults ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-500 p-8">
            <h3 className="text-lg font-semibold text-gray-700">No Results Found</h3>
            <p className="text-sm">Try a different name or clear the search.</p>
          </div>
        ) : (
          <div className="p-3 space-y-4">
            {Object.entries(filteredAndGroupedTransactions).map(([monthYear, txs]) => (
              <section key={monthYear}>
                <h3 className="text-xs font-bold text-gray-500 uppercase px-2 mb-2">{monthYear.replace(' ', " '")}</h3>
                <ul className="space-y-2">
                  {(txs as Transaction[]).map(tx => (
                    <TransactionItem
                      key={tx.id}
                      transaction={tx}
                      isEditMode={isEditMode}
                      isSelected={selectedTxIds.has(tx.id)}
                      onSelect={() => handleSelectTransaction(tx.id)}
                      onView={() => onTransactionClick(tx)}
                      onDelete={() => {
                        if (window.confirm('Are you sure you want to delete this transaction?')) {
                          onDeleteTransaction(tx.id);
                        }
                      }}
                    />
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
      </main>

      {isEditMode && hasResults && (
        <footer className="sticky bottom-0 z-10 p-3 bg-white/90 backdrop-blur-sm border-t border-gray-200">
            <button
                onClick={handleBulkDelete}
                disabled={selectedTxIds.size === 0}
                className="w-full py-3 text-lg font-semibold bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all"
            >
                Delete ({selectedTxIds.size})
            </button>
        </footer>
      )}
    </div>
  );
};

export default TransactionHistoryPage;