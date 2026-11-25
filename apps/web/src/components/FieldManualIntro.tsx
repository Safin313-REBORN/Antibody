import React from 'react';
import { AlienCharacter } from './AlienCharacter';

interface FieldManualIntroProps {
  lang: 'bn' | 'en';
  onStartDemo: () => void;
  onOpenEncyclopedia: () => void;
}

const STEPS = [
  {
    num: '01',
    title: { bn: 'অতিথি বা এজেন্ট আইডি', en: 'Anonymous Agent ID' },
    desc: {
      bn: 'ইমেইল বা ফোন নম্বর ছাড়াই ১ ক্লিকে শুরু করুন।',
      en: 'Start in 1 tap with zero email, phone, or tracking.'
    }
  },
  {
    num: '02',
    title: { bn: 'টাকা-পে স্যান্ডবক্স', en: 'Taka-Pay Sandbox' },
    desc: {
      bn: '৫,০০০ কাল্পনিক টাকা দিয়ে পিন ও ওটিপি সুরক্ষা শিখুন।',
      en: 'Practice wallet PIN & OTP safety with 5,000 pretend taka.'
    }
  },
  {
    num: '03',
    title: { bn: 'স্ক্যাম কল ও এক্স-রে', en: 'Scam Call & X-Ray' },
    desc: {
      bn: 'প্রতারকের জরুরি চাপ ও ভুয়া কর্তৃত্ব এক্স-রে করে চিনুন।',
      en: 'Dissect fake officer calls and psychological pressure tactics.'
    }
  },
  {
    num: '04',
    title: { bn: 'অ্যান্টিবডি ও পরীক্ষা', en: 'Antibodies & Exam' },
    desc: {
      bn: 'প্রতিরক্ষা নিয়ম গড়ে তুলুন এবং আসল বনাম নকল বার্তা যাচাই করুন।',
      en: 'Build defense rules and spot scams without blocking real alerts.'
    }
  }
];

export const FieldManualIntro: React.FC<FieldManualIntroProps> = ({
  lang,
  onStartDemo,
  onOpenEncyclopedia
}) => {
  return (
    <section
      aria-label={lang === 'bn' ? 'ব্যবহার নির্দেশিকা ও পরিচিতি' : 'How Antibody Works & Purpose'}
      className="max-w-3xl mx-auto mt-4 mb-6 bg-paper hand-border p-6 shadow-ink-lg space-y-5"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b-2 border-ink pb-4">
        <div className="space-y-1.5">
          <span className="font-mono text-xs bg-mustard text-ink px-2 py-0.5 font-bold uppercase tracking-wider">
            FIELD MANUAL 00 // {lang === 'bn' ? 'কীভাবে কাজ করে' : 'HOW IT WORKS'}
          </span>
          <h2 className="font-serif font-bold text-2xl sm:text-3xl text-ink riso-misregister" data-text={lang === 'bn' ? 'অ্যান্টিবডি কী এবং কেন?' : 'What is Antibody & How It Works'}>
            {lang === 'bn' ? 'অ্যান্টিবডি কী এবং কেন?' : 'What is Antibody & How It Works'}
          </h2>
          <p className="font-sans text-sm sm:text-base text-ink leading-relaxed">
            {lang === 'bn'
              ? 'অ্যান্টিবডি (Antibody) একটি বিনামূল্যের শিক্ষামূলক ব্রাউজার গেম। এটি একটি কৌতূহলী এলিয়েনের মাধ্যমে নতুন ডিজিটাল ব্যবহারকারীদের শেখায়—কীভাবে ঢাকার মোবাইল ব্যাংকিং ও ফোন স্ক্যাম চিনে নিজেকে সুরক্ষিত রাখতে হয়।'
              : 'Antibody is a free interactive training game that teaches first-time digital users—through a naive alien visiting Dhaka—how to recognize and resist mobile-money and phone scams.'}
          </p>
        </div>
        <div className="shrink-0 self-center sm:self-start">
          <AlienCharacter mood="curious" size={88} />
        </div>
      </div>

      {/* 4-Step Guide Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {STEPS.map((step) => (
          <div key={step.num} className="p-3 bg-[#FAF5EC] border-2 border-ink space-y-1">
            <span className="font-mono text-xs font-bold text-teal">STEP {step.num}</span>
            <h3 className="font-serif font-bold text-base text-ink">{step.title[lang]}</h3>
            <p className="font-sans text-xs text-faded-ink leading-relaxed">{step.desc[lang]}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 font-mono text-xs">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onStartDemo}
            className="min-h-[44px] px-4 py-2 bg-mustard text-ink font-bold border-2 border-ink shadow-ink-blot hover:bg-mustard/90"
          >
            {lang === 'bn' ? 'সরাসরি ডেমো দেখুন (4-Min Story)' : 'Launch 4-Min Demo Story'}
          </button>
          <button
            type="button"
            onClick={onOpenEncyclopedia}
            className="min-h-[44px] px-4 py-2 bg-paper text-ink font-bold border-2 border-ink hover:bg-teal/15"
          >
            {lang === 'bn' ? '৬টি স্ক্যাম জীবাণু দেখুন' : 'View 6 Scam Pathogens'}
          </button>
        </div>
        <span className="text-faded-ink">
          {lang === 'bn' ? 'নিচে লগইন করে শুরু করুন ↓' : 'Sign in or play as guest below ↓'}
        </span>
      </div>
    </section>
  );
};
