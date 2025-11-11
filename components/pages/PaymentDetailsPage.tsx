import React, { useState, useEffect } from 'react';
import type { PayeeInfo, Transaction } from '../../types';
import {
  ChevronLeftIcon,
  ShareIcon,
  HelpIcon,
  CopyIcon,
  UpiLogo,
  YesBankLogo,
  SparklesIcon,
} from '../../constants/icons';

interface PaymentDetailsPageProps {
  onBack: () => void;
  onSwitchToPay: (payee: PayeeInfo) => void;
  payee?: PayeeInfo;
  onPaymentSuccess?: (transaction: Transaction) => void;
  transaction?: Transaction;
  transactions?: Transaction[];
  onDeleteTransaction?: (id: string) => void;
}
const playSuccessSound = () => {
  const audio = new Audio('https://cdn.pixabay.com/audio/2022/03/15/audio_2b2358c279.mp3');
  audio.play().catch((e) => console.error('Audio playback failed:', e));
};

const playProcessingSound = () => {
  const audio = new Audio('https://raw.githubusercontent.com/Nitesh-Sharma2005/Super_Money1/main/payment.mp3');
  audio.play().catch((e) => console.error('Audio playback failed:', e));
};


const PinPadButton: React.FC<{ value: string; onClick: (value: string) => void; children?: React.ReactNode }> = ({
  value,
  onClick,
  children,
}) => (
  <button
    onClick={() => onClick(value)}
    className="w-16 h-16 rounded-full bg-gray-200/60 text-2xl font-semibold text-gray-800 flex items-center justify-center transition-colors hover:bg-gray-300/80 active:bg-gray-400/80"
  >
    {children || value}
  </button>
);

const PaymentDetailsPage: React.FC<PaymentDetailsPageProps> = ({
  onBack,
  onSwitchToPay,
  payee,
  onPaymentSuccess,
  transaction,
  transactions,
  onDeleteTransaction,
}) => {
  const [amount, setAmount] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success'>(
    transaction ? 'success' : 'idle'
  );
  const [transactionDetails, setTransactionDetails] = useState<Transaction | null>(transaction || null);
  const [copied, setCopied] = useState(false);
  const [isPinModalVisible, setIsPinModalVisible] = useState(false);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');

  const processPayment = () => {
    if (payee && onPaymentSuccess) {
      const numericAmount = parseFloat(amount);
      if (numericAmount > 0) {
        const newTransaction: Transaction = {
          id: `564514873${Math.floor(100 + Math.random() * 900)}`,
          payee,
          amount: numericAmount,
          timestamp: new Date(),
          cashbackPercentage: Math.random() * 0.4 + 0.1,
        };
        setTransactionDetails(newTransaction);
        onPaymentSuccess(newTransaction);
      }
    }
  };

  const handleProceedClick = () => {
    setPin('');
    setPinError('');
    setIsPinModalVisible(true);
  };

  const handlePinKeyClick = (key: string) => {
    if (pin.length < 4) setPin(pin + key);
  };

  const handlePinDelete = () => setPin(pin.slice(0, -1));

  useEffect(() => {
    if (pin.length === 4) {
      setTimeout(() => {
        if (pin === '2580') {
          setIsPinModalVisible(false);
          processPayment();
          setPaymentStatus('processing');
          playProcessingSound();
          setTimeout(() => {
            setPaymentStatus('success');
          }, 5000);
        } else {
          setPinError('Incorrect PIN');
          const pinDots = document.getElementById('pin-dots');
          pinDots?.classList.add('animate-shake');
          setTimeout(() => {
            setPin('');
            setPinError('');
            pinDots?.classList.remove('animate-shake');
          }, 800);
        }
      }, 200);
    }
  }, [pin]);

  useEffect(() => {
    if (paymentStatus === 'success') {
      playSuccessSound();
    }
  }, [paymentStatus]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDeleteClick = (id: string) => {
    if (onDeleteTransaction && window.confirm('Are you sure you want to delete this payment history?')) {
        onDeleteTransaction(id);
        if (transactionDetails && id === transactionDetails.id) {
          onBack();
        }
    }
  };

  const formatDate = (date: Date) =>
    new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
      .format(date)
      .replace(',', ' •')
      .replace(' at', '');

  if (paymentStatus === 'processing') {
    return (
      <div className="flex flex-col h-full bg-green-500 items-center justify-center font-sans text-white text-center p-4">
        <style>{`
          .success-animation { margin:50px auto; }
          .checkmark { width: 100px; height: 100px; border-radius: 50%; display: block; stroke-width: 4; stroke: #fff; stroke-miterlimit: 10; box-shadow: inset 0px 0px 0px #4bb71b; margin: 0 auto; animation: fill .4s ease-in-out .4s forwards, scale .3s ease-in-out .9s both; }
          .checkmark__circle { stroke-dasharray: 166; stroke-dashoffset: 166; stroke-width: 4; stroke-miterlimit: 10; stroke: #fff; fill: none; animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards; }
          .checkmark__check { transform-origin: 50% 50%; stroke-dasharray: 48; stroke-dashoffset: 48; animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards; }
          @keyframes stroke { 100% { stroke-dashoffset: 0; } }
          @keyframes scale { 0%, 100% { transform: none; } 50% { transform: scale3d(1.1, 1.1, 1); } }
          @keyframes fill { 100% { box-shadow: inset 0px 0px 0px 60px #4bb71b; } }
        `}</style>
        <div className="success-animation">
          <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
            <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none" />
            <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold mt-6">Payment Successful</h2>
        <p className="text-lg text-white/80 mt-2">Hang tight, preparing your receipt...</p>
      </div>
    );
  }

  if (paymentStatus === 'success' && transactionDetails) {
    return (
      <div className="flex flex-col h-full bg-gray-100 text-gray-800 font-sans">
        <header className="flex items-center justify-between p-4">
          <button onClick={onBack} className="p-2 text-gray-600 hover:text-gray-900">
            <ChevronLeftIcon className="w-6 h-6" />
          </button>
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-600 hover:text-gray-900">
              <ShareIcon className="w-6 h-6" />
            </button>
            <button className="p-2 text-gray-600 hover:text-gray-900">
              <HelpIcon className="w-6 h-6" />
            </button>
          </div>
        </header>

        <main className="flex-1 flex flex-col items-center text-center px-6 py-8 overflow-y-auto">
          <div className="relative w-24 h-24 mb-4">
            <div className="w-full h-full rounded-2xl shadow-lg flex items-center justify-center bg-green-500 animate-bounce-in">
              <svg className="w-16 h-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          <h1 className="text-xl font-bold text-gray-900">Payment successful</h1>
          <p className="text-gray-600 mb-4">to {transactionDetails.payee.name}</p>
          <p className="text-5xl font-bold text-gray-900 mb-6">₹{transactionDetails.amount.toFixed(0)}</p>

          <div className="w-full max-w-xs bg-green-100/80 border border-green-200 rounded-full flex items-center p-2 space-x-2 mb-8">
            <img src="https://i.imgur.com/J3lR42V.png" alt="cashback" className="w-10 h-10 -ml-1" />
            <p className="text-sm font-semibold text-green-800">
              You earned {transactionDetails.cashbackPercentage.toFixed(1)}% cashback
            </p>
          </div>

          <div className="text-sm text-gray-500">
            <p>{formatDate(new Date(transactionDetails.timestamp))}</p>
            <div className="flex items-center justify-center mt-2">
              <p>UPI Transaction ID: {transactionDetails.id}</p>
              <button
                onClick={() => handleCopy(transactionDetails.id)}
                className="ml-2 p-1 text-gray-500 hover:text-gray-800 relative"
              >
                <CopyIcon className="w-4 h-4" />
                {copied && (
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs bg-gray-800 text-white px-2 py-1 rounded">
                    Copied!
                  </span>
                )}
              </button>
            </div>
          </div>

          <div className="mt-6 w-full max-w-md text-left">
            <h2 className="text-lg font-bold mb-2">Payment History</h2>
            <ul className="space-y-2">
              {(transactions ?? []).map((tx) => (
                <li
                  key={tx.id}
                  className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm border"
                >
                  <div>
                    <p className="text-sm font-semibold">{tx.payee.name}</p>
                    <p className="text-xs text-gray-500">{formatDate(new Date(tx.timestamp))}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <p className="font-bold">₹{tx.amount.toFixed(0)}</p>
                    <button
                      onClick={() => handleDeleteClick(tx.id)}
                      className="text-red-500 hover:text-red-700"
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </main>

        <footer className="p-4 bg-white border-t border-gray-200 grid grid-cols-2 gap-3">
          <button
            onClick={onBack}
            className="w-full py-3 text-lg font-semibold bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
          >
            Done
          </button>
          <button
            onClick={() => onSwitchToPay(transactionDetails.payee)}
            className="w-full py-3 text-lg font-semibold bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Pay Again
          </button>
        </footer>
      </div>
    );
  }

  const currentPayee = payee || transaction?.payee;
  if (!currentPayee) {
    return (
      <div className="p-4">
        <button onClick={onBack} className="flex items-center text-gray-600">
          <ChevronLeftIcon className="w-5 h-5 mr-2" /> Back
        </button>
        <p className="mt-4 text-red-500 text-center">Error: No payee information provided.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#F7F8F9] text-gray-800 font-sans">
      <header className="px-4 pt-4 pb-2">
        <button onClick={onBack} className="p-1">
          <ChevronLeftIcon className="w-6 h-6 text-gray-800" />
        </button>
      </header>

      <main className="flex-grow flex flex-col px-6 pt-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{currentPayee.name}</h1>
          <p className="text-sm text-gray-500 mt-1">UPI ID: {currentPayee.upiId}</p>
        </div>

        <div className="relative flex items-center border-b-2 border-gray-200 pb-2 mb-4">
          <span className="text-5xl font-light text-gray-500 mr-2">₹</span>
          <input
            type="text"
            value={amount}
            onChange={(e) => {
              const value = e.target.value.replace(/[^0-9]/g, '');
              setAmount(value);
            }}
            placeholder="0"
            className="bg-transparent text-7xl font-bold text-gray-900 w-full focus:outline-none tracking-tight p-0 border-0"
            autoFocus
            inputMode="numeric"
            style={{ caretColor: '#8B5CF6' }}
          />
        </div>

        <div className="flex items-center text-green-600 mb-4">
          <SparklesIcon className="w-5 h-5 mr-2 text-green-500" />
          <span className="font-semibold text-sm">With superCard Pro, earn cashback</span>
        </div>
        
        <button className="self-start px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg">
            Pay to BharatPe Merchant
        </button>
      </main>

      <footer className="px-6 py-4 bg-[#F7F8F9]">
        <button
          onClick={handleProceedClick}
          disabled={!amount || parseFloat(amount) <= 0}
          className={`w-full py-4 text-lg font-semibold rounded-xl transition-all ${
            !amount || parseFloat(amount) <= 0
              ? 'bg-gray-200 text-gray-500'
              : 'bg-gray-800 text-white shadow-lg shadow-gray-800/30'
          }`}
        >
          Pay ₹{amount || 0}
        </button>
        <div className="flex items-center justify-center mt-3 space-x-2 text-gray-400">
          <p className="text-xs font-medium">Powered by</p>
          <UpiLogo className="h-4" />
          <div className="h-4 w-px bg-gray-300"></div>
          <YesBankLogo className="h-5" />
        </div>
      </footer>
      
      {isPinModalVisible && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end">
          <div className="w-full bg-white rounded-t-2xl p-4 flex flex-col items-center animate-slide-up">
            <div className="w-12 h-1.5 bg-gray-300 rounded-full mb-4"></div>
            <h2 className="text-lg font-semibold text-gray-800">Enter UPI PIN</h2>
            <p className="text-sm text-gray-500 mb-6">to pay {currentPayee.name}</p>

            <div id="pin-dots" className="flex space-x-4 mb-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className={`w-4 h-4 rounded-full border-2 ${pin.length > i ? 'bg-gray-800 border-gray-800' : 'border-gray-400'}`}></div>
              ))}
            </div>
            
            {pinError && <p className="text-red-500 text-sm mb-4 h-5">{pinError}</p>}

            <div className="grid grid-cols-3 gap-6">
              <PinPadButton value="1" onClick={handlePinKeyClick} />
              <PinPadButton value="2" onClick={handlePinKeyClick} />
              <PinPadButton value="3" onClick={handlePinKeyClick} />
              <PinPadButton value="4" onClick={handlePinKeyClick} />
              <PinPadButton value="5" onClick={handlePinKeyClick} />
              <PinPadButton value="6" onClick={handlePinKeyClick} />
              <PinPadButton value="7" onClick={handlePinKeyClick} />
              <PinPadButton value="8" onClick={handlePinKeyClick} />
              <PinPadButton value="9" onClick={handlePinKeyClick} />
              <div/>
              <PinPadButton value="0" onClick={handlePinKeyClick} />
              <PinPadButton value="del" onClick={handlePinDelete}>
                <ChevronLeftIcon className="w-7 h-7" />
              </PinPadButton>
            </div>

            <style>{`
              @keyframes slide-up {
                from { transform: translateY(100%); }
                to { transform: translateY(0); }
              }
              .animate-slide-up { animation: slide-up 0.3s ease-out; }

              @keyframes shake {
                0%, 100% { transform: translateX(0); }
                10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                20%, 40%, 60%, 80% { transform: translateX(5px); }
              }
              .animate-shake { animation: shake 0.5s ease-in-out; }
            `}</style>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentDetailsPage;
