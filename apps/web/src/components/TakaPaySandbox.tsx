import React, { useState } from 'react';
import { AlienCharacter } from './AlienCharacter';

interface TakaPaySandboxProps {
  balance: number;
  onFirstTransferComplete: () => void;
  lang: 'bn' | 'en';
}

export const TakaPaySandbox: React.FC<TakaPaySandboxProps> = ({
  balance,
  onFirstTransferComplete,
  lang
}) => {
  const [recipient, setRecipient] = useState('01700-123456');
  const [amount, setAmount] = useState('500');
  const [pin, setPin] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [transferDone, setTransferDone] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length === 4) {
      setTransferDone(true);
      setTimeout(() => {
        onFirstTransferComplete();
      }, 1500);
    }
  };

  return (
    <div className="max-w-md mx-auto my-6 bg-[#FAF6EE] border-4 border-ink p-4 rounded-xl shadow-ink-lg relative">
      {/* Phone Screen Mockup Bezel */}
      <h1 className="sr-only">{lang === 'bn' ? 'টাকা-পে ওয়ালেট স্যান্ডবক্স' : 'Taka-Pay Wallet Sandbox'}</h1>
      <div className="bg-ink text-paper py-2 px-4 rounded-t-lg flex justify-between items-center text-xs font-mono">
        <span className="font-bold flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-teal animate-ping inline-block" />
          টাকা-পে (Taka-Pay)
        </span>
        <span>4G • 98%</span>
      </div>

      {/* Margin Note Annotation */}
      <div className="absolute -left-36 top-16 hidden lg:block w-32 font-mono text-[11px] text-faded-ink border-l-2 border-mustard pl-2">
        <span className="font-bold text-mustard block">SPECIMEN NOTE:</span>
        ডিজিটাল ওয়ালেট সিমুলেশন। ৫,০০০ কাল্পনিক টাকা বরাদ্দ।
      </div>

      <div className="p-4 bg-paper border-x-2 border-b-2 border-ink space-y-4">
        {/* Wallet Balance Card */}
        <div className="bg-ink text-paper p-4 rounded-lg flex justify-between items-center">
          <div>
            <span className="text-[11px] font-mono text-faded-ink block">
              {lang === 'bn' ? 'বর্তমান ব্যালেন্স' : 'Current Balance'}
            </span>
            <div className="text-3xl font-mono font-bold text-mustard">
              ৳ {balance.toLocaleString()}
            </div>
          </div>
          <div className="text-right">
            <span className="inline-block bg-teal/20 text-teal border border-teal text-[10px] font-mono px-2 py-0.5 rounded">
              VERIFIED TIER-1
            </span>
          </div>
        </div>

        {/* Transfer Tutorial Dialog */}
        {!transferDone ? (
          <form onSubmit={handleSend} className="space-y-3">
            <div className="text-xs font-mono font-bold text-ink">
              {lang === 'bn' ? 'প্রথম শিক্ষামূলক লেনদেন (মুদি দোকান):' : 'Tutorial Transfer (Grocery Vendor):'}
            </div>

            <div>
              <label className="block text-[11px] font-mono text-faded-ink">
                {lang === 'bn' ? 'প্রাপকের নম্বর' : 'Recipient Number'}
              </label>
              <input
                type="text"
                disabled
                value={recipient}
                className="w-full bg-[#EAE2D2] border border-ink p-2 text-xs font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-faded-ink">
                {lang === 'bn' ? 'টাকার পরিমাণ (৳)' : 'Amount (৳)'}
              </label>
              <input
                type="text"
                disabled
                value={amount}
                className="w-full bg-[#EAE2D2] border border-ink p-2 text-xs font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-faded-ink">
                {lang === 'bn' ? '৪ ডিজিটের গোপন পিন (ডেমো: 1234)' : 'Secret 4-Digit PIN (Demo: 1234)'}
              </label>
              <input
                type="password"
                maxLength={4}
                value={pin}
                placeholder="****"
                onChange={(e) => setPin(e.target.value)}
                required
                className="w-full bg-paper border-2 border-ink p-2 text-center text-lg font-mono tracking-widest focus:ring-2 focus:ring-mustard outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={pin.length !== 4}
              className={`w-full py-2.5 font-mono font-bold text-xs uppercase tracking-wider border-2 border-ink shadow-ink-blot transition-all ${
                pin.length === 4
                  ? 'bg-mustard text-ink hover:bg-mustard/90'
                  : 'bg-paper text-faded-ink opacity-60'
              }`}
            >
              {lang === 'bn' ? 'টাকা পাঠান (Send Money)' : 'Send Money'}
            </button>
          </form>
        ) : (
          <div className="py-6 text-center space-y-2">
            <span className="rubber-stamp rubber-stamp-safe text-lg">
              {lang === 'bn' ? 'লেনদেন সফল' : 'TRANSACTION OK'}
            </span>
            <p className="text-xs font-mono text-faded-ink">
              {lang === 'bn'
                ? 'এলিয়েন বুঝতে পেরেছে: পিন নম্বর কারো সাথে শেয়ার করা যায় না।'
                : 'Subject learned: PIN is private knowledge.'}
            </p>
          </div>
        )}
      </div>

      <div className="flex justify-center mt-3">
        <AlienCharacter mood={transferDone ? 'proud' : 'curious'} size={80} />
      </div>
    </div>
  );
};
