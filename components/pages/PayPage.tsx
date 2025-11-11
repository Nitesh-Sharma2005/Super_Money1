import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { PayeeInfo, Transaction, UpiContact } from '../../types';
import PaymentDetailsPage from './PaymentDetailsPage';
import TransactionHistoryPage from './TransactionHistoryPage';
import { QrCodeIcon, ArrowLeftIcon, ReceiptIcon, HelpIcon, AtSymbolIcon, UserGroupIcon } from '../../constants/icons';

interface PayPageProps {
  transactions: Transaction[];
  onAddTransaction: (transaction: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
  onDeleteMultipleTransactions: (ids: string[]) => void;
  onClearAllTransactions: () => void;
  upiContacts: UpiContact[];
}

// Helper to determine if a UPI ID belongs to a merchant
const isMerchantUpi = (upiId: string, payeeName?: string | null): boolean => {
  const lowerCaseUpiId = upiId.toLowerCase();
  const lowerCasePayeeName = payeeName?.toLowerCase() || '';

  // Check for merchant-specific prefixes in UPI ID
  const merchantPrefixes = ['paytmqr'];
  if (merchantPrefixes.some(prefix => lowerCaseUpiId.startsWith(prefix))) {
    return true;
  }

  // Check for merchant-specific handles in UPI ID
  const merchantHandles = ['@ptys', '@pty'];
  if (merchantHandles.some(handle => lowerCaseUpiId.endsWith(handle))) {
    return true;
  }
  
  // Check for business-related keywords in the payee name
  const merchantKeywords = ['mart', 'stores', 'merchant', 'shop', 'limited', 'pvt', 'llp'];
  if (merchantKeywords.some(keyword => lowerCasePayeeName.includes(keyword))) {
    return true;
  }

  return false;
};


// Helper to parse UPI QR code data with new logic
const parseUpiUrl = (url: string, contacts: UpiContact[]): PayeeInfo | null => {
  try {
    if (!url.startsWith('upi://pay')) return null;
    const queryString = url.split('?')[1];
    if (!queryString) return null;
    
    const params = new URLSearchParams(queryString);
    const pa = params.get('pa'); // UPI ID
    const pn = params.get('pn'); // Payee Name
    
    if (!pa) return null;

    const decodedPn = pn ? decodeURIComponent(pn.replace(/\+/g, ' ')) : null;

    // Check if it's a merchant account
    if (isMerchantUpi(pa, decodedPn)) {
      // For merchants, check stored list first
      const storedContact = contacts.find(c => c.upiId.toLowerCase() === pa.toLowerCase());
      if (storedContact) {
        return { name: storedContact.name, upiId: pa };
      }
      // If not in list, fallback to QR name, then UPI ID
      return { name: decodedPn || pa, upiId: pa };
    } else {
      // For personal accounts, prioritize QR name, then UPI ID
      return { name: decodedPn || pa, upiId: pa };
    }
  } catch (e) {
    console.error("Failed to parse UPI URL:", e);
    return null;
  }
};


const PayPage: React.FC<PayPageProps> = ({ transactions, onAddTransaction, onDeleteTransaction, onDeleteMultipleTransactions, onClearAllTransactions, upiContacts }) => {
  const [view, setView] = useState<'main' | 'scanning' | 'details' | 'history' | 'transactionDetail'>('main');
  const [payee, setPayee] = useState<PayeeInfo | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const handleScanClick = () => setView('scanning');
  const handleHistoryClick = () => setView('history');

  // Fix: Memoize handler function with useCallback to prevent unnecessary re-renders.
  const handleBack = useCallback(() => {
    setView('main');
    setPayee(null);
  }, []);
  
  // Fix: Memoize handler function with useCallback to prevent unnecessary re-renders.
  const handleScanSuccess = useCallback((scannedPayee: PayeeInfo) => {
      setPayee(scannedPayee);
      setView('details');
  }, []);

  // Fix: Memoize handler function with useCallback to prevent unnecessary re-renders.
  const handleTransactionClick = useCallback((transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setView('transactionDetail');
  }, []);
  
  // Fix: Memoize handler function with useCallback to prevent unnecessary re-renders.
  const handleSwitchToPay = useCallback((payeeInfo: PayeeInfo) => {
    setPayee(payeeInfo);
    setSelectedTransaction(null);
    setView('details');
  }, []);


  if (view === 'scanning') {
    return <QRScanner onCancel={handleBack} onScanSuccess={handleScanSuccess} upiContacts={upiContacts} />;
  }

  if (view === 'details' && payee) {
    return <PaymentDetailsPage payee={payee} onBack={handleBack} onPaymentSuccess={onAddTransaction} onSwitchToPay={handleSwitchToPay} transactions={transactions} onDeleteTransaction={onDeleteTransaction} />;
  }

  if (view === 'transactionDetail' && selectedTransaction) {
    return <PaymentDetailsPage transaction={selectedTransaction} onBack={() => { setView('history'); setSelectedTransaction(null); }} onSwitchToPay={handleSwitchToPay} transactions={transactions} onDeleteTransaction={onDeleteTransaction} />
  }
  
  if (view === 'history') {
    return <TransactionHistoryPage 
              transactions={transactions} 
              onBack={handleBack} 
              onTransactionClick={handleTransactionClick} 
              onDeleteTransaction={onDeleteTransaction}
              onDeleteMultipleTransactions={onDeleteMultipleTransactions}
              onClearAllTransactions={onClearAllTransactions}
            />;
  }

  return (
    <div className="h-full flex flex-col justify-between bg-gray-50 text-gray-900 font-sans">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold">Super<span className="text-purple-500">.</span>Money</h1>
        <button className="p-2 text-gray-500 rounded-full hover:bg-gray-100">
          <HelpIcon className="w-6 h-6" />
        </button>
      </header>
      
      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="space-y-4 w-full">
            <p className="text-gray-500">One-tap payments</p>
            <button 
              onClick={handleScanClick}
              className="w-full flex flex-col items-center justify-center p-8 bg-purple-600 hover:bg-purple-700 rounded-2xl transition-transform transform hover:scale-105 shadow-lg shadow-purple-500/30 text-white"
            >
              <QrCodeIcon className="w-12 h-12 mb-4" />
              <span className="text-xl font-semibold">Scan any QR to pay</span>
              <span className="text-sm text-purple-200 mt-1">Instant & Secure</span>
            </button>
        </div>
      </main>
      
      {/* Footer Actions */}
      <footer className="p-4 border-t border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="grid grid-cols-3 gap-2 text-center">
            <FooterButton icon={<AtSymbolIcon className="w-6 h-6" />} label="Pay UPI ID" />
            <FooterButton icon={<UserGroupIcon className="w-6 h-6" />} label="Pay Contact" />
            <FooterButton icon={<ReceiptIcon className="w-6 h-6" />} label="History" onClick={handleHistoryClick} />
        </div>
      </footer>
    </div>
  );
};

const FooterButton: React.FC<{ icon: React.ReactNode; label: string; onClick?: () => void; }> = ({ icon, label, onClick }) => (
    <button onClick={onClick} className="flex flex-col items-center justify-center p-3 space-y-1 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
        {icon}
        <span className="text-xs font-medium">{label}</span>
    </button>
);


const QRScanner: React.FC<{ onCancel: () => void; onScanSuccess: (payee: PayeeInfo) => void; upiContacts: UpiContact[] }> = ({ onCancel, onScanSuccess, upiContacts }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [error, setError] = useState<string | null>(null);
    const scanInterval = useRef<number | null>(null);

    useEffect(() => {
        let stream: MediaStream | null = null;
        
        const cleanup = () => {
             if (scanInterval.current) {
                clearInterval(scanInterval.current);
                scanInterval.current = null;
             }
             if (stream) {
                stream.getTracks().forEach(track => track.stop());
             }
        };

        const startScan = async () => {
            // Fix: Check for BarcodeDetector existence on the window object safely.
            if (!('BarcodeDetector' in window) || !navigator.mediaDevices?.getUserMedia) {
                setError('QR code scanning is not supported on this device or browser.');
                return;
            }

            try {
                stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    await videoRef.current.play();
                }

                // Fix: No longer need @ts-ignore due to global type definitions.
                const barcodeDetector = new window.BarcodeDetector({ formats: ['qr_code'] });
                
                scanInterval.current = window.setInterval(async () => {
                    if (videoRef.current && !videoRef.current.paused && videoRef.current.readyState === 4) {
                        try {
                            const barcodes = await barcodeDetector.detect(videoRef.current);
                            if (barcodes.length > 0) {
                                // Stop scanning once a QR is found
                                cleanup();
                                const upiData = parseUpiUrl(barcodes[0].rawValue, upiContacts);
                                if (upiData) {
                                    onScanSuccess(upiData);
                                } else {
                                    // If found QR is not a valid UPI, allow user to go back and try again
                                    setError('Invalid or non-UPI QR code detected.');
                                }
                            }
                        } catch (e) {
                             console.error("Barcode detection failed:", e);
                        }
                    }
                }, 500); // Scan every 500ms

            } catch (err) {
                console.error("Camera access error:", err);
                if (err instanceof Error && err.name === 'NotAllowedError') {
                     setError('Camera permission denied. Please enable it in your browser settings.');
                } else {
                     setError('Could not access camera.');
                }
            }
        };

        startScan();

        return cleanup;
    }, [onScanSuccess, upiContacts]);

    return (
      <div className="relative flex flex-col items-center justify-center h-full bg-black text-white p-4 overflow-hidden">
        <video ref={videoRef} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full object-cover" muted playsInline aria-hidden="true" />
        
        <div className="absolute inset-0 bg-black/50 z-10"></div>
        
        <button onClick={onCancel} className="absolute top-6 left-6 z-20 text-white p-2 rounded-full bg-black/30 hover:bg-black/50" aria-label="Go back">
          <ArrowLeftIcon className="w-6 h-6" />
        </button>
        
        {error && (
            <div className="absolute bottom-24 z-20 p-3 bg-red-600/90 rounded-lg text-sm shadow-lg animate-fade-in-up" role="alert">
                {error}
            </div>
        )}
        
        <div className="z-20 text-center">
            <h2 className="text-2xl font-bold">Scan QR Code</h2>
            <p className="mt-2 text-white/80">Position the QR code within the frame</p>
            <div className="relative w-64 h-64 mt-8">
                <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-white rounded-tl-2xl"></div>
                <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-white rounded-tr-2xl"></div>
                <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-white rounded-bl-2xl"></div>
                <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-white rounded-br-2xl"></div>
            </div>
        </div>
      </div>
    );
};

export default PayPage;