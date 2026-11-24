import React, { useState } from 'react';

interface FaqAccordionProps {
  lang: 'bn' | 'en';
}

const FAQ_ITEMS = [
  {
    q: {
      bn: 'টাকা-পে কি আসল মোবাইল ব্যাংকিং অ্যাপ?',
      en: 'Is Taka-Pay a real mobile-money service?'
    },
    a: {
      bn: 'না। টাকা-পে এবং এর ৫,০০০ টাকা সম্পূর্ণ কাল্পনিক শিক্ষামূলক সিমুলেশন। এখানে কোনো আসল লেনদেন হয় না।',
      en: 'No. Taka-Pay and the 5,000 taka balance are 100% fictional training simulations. No real money is ever moved.'
    }
  },
  {
    q: {
      bn: 'বৈধ মেসেজ ব্লক করলে কেন FALSE ALARM হয়?',
      en: 'Why does blocking a legitimate message trigger a FALSE ALARM?'
    },
    a: {
      bn: 'প্রকৃত ডিজিটাল সুরক্ষা মানে সবকিছু ব্লক করা নয়, বরং আসল ও ভুয়া বার্তার পার্থক্য চেনা।',
      en: 'True digital literacy means distinguishing real utility or bank alerts from social engineering, not blocking everything.'
    }
  },
  {
    q: {
      bn: '৩ শব্দের পাসফ্রেজ ভুলে গেলে কী করব?',
      en: 'What if I forget my 3-word passphrase?'
    },
    a: {
      bn: 'গোপনীয়তা রক্ষার্থে আমরা ইমেইল বা ফোন নম্বর রাখি না, তাই পাসফ্রেজ রিসেট করা যায় না। আপনি যেকোনো সময় নতুন অতিথি বা এজেন্ট আইডি শুরু করতে পারেন।',
      en: 'For strict privacy we store zero email or phone recovery info. You can start a fresh Field Agent ID or Guest session anytime.'
    }
  }
];

export const FaqAccordion: React.FC<FaqAccordionProps> = ({ lang }) => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section aria-label="Frequently Asked Questions" className="max-w-3xl mx-auto my-8 bg-paper hand-border p-6 shadow-ink-blot space-y-3">
      <h2 className="font-serif font-bold text-xl text-ink border-b-2 border-ink pb-2">
        {lang === 'bn' ? 'সচরাচর জিজ্ঞাসিত প্রশ্ন (FAQ)' : 'Field Manual FAQ'}
      </h2>
      <div className="space-y-2">
        {FAQ_ITEMS.map((item, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div key={idx} className="border-2 border-ink bg-[#FAF5EC]">
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full min-h-[48px] px-4 py-3 text-left font-mono text-xs sm:text-sm font-bold text-ink flex justify-between items-center hover:bg-mustard/20 transition-colors"
              >
                <span>{item.q[lang]}</span>
                <span aria-hidden="true" className="ml-2 font-mono text-base">
                  {isOpen ? '−' : '+'}
                </span>
              </button>
              {isOpen && (
                <div className="px-4 pb-3 pt-1 font-sans text-sm text-faded-ink border-t border-ink/20 leading-relaxed animate-fadeIn">
                  {item.a[lang]}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
