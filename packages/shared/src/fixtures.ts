import { Scenario } from './index.js';

export const SCENARIO_FIXTURES: Scenario[] = [
  {
    id: 'scen_01_taka_pay_pin_call',
    seed: 101,
    channel: 'phone_call',
    persona: {
      name: { bn: 'জনাব রফিকুল (ভুয়ো ব্যাংক অফিসার)', en: 'Mr. Rafiq (Fake Support Officer)' },
      role: { bn: 'টাকা-পে প্রধান নিরাপত্তা দপ্তর', en: 'Taka-Pay Central Security Cell' },
      avatarSeed: 'officer_bad'
    },
    tactics: ['urgency', 'authority', 'fear'],
    ask: 'PIN / OTP disclosure',
    legitimacy: 'scam',
    templateVersion: '1.0.0',
    content: {
      title: {
        bn: 'কেস ০১: "আপনার অ্যাকাউন্ট লক হয়ে যাচ্ছে!"',
        en: 'Case 01: "Your Account is Being Suspended!"'
      },
      dialogue: [
        {
          speaker: 'counterpart',
          text: {
            bn: 'আসসালামু আলাইকুম, আমি টাকা-পে প্রধান কার্যালয় থেকে সহকারী পরিচালক রফিকুল ইসলাম বলছি।',
            en: 'Greetings, I am Assistant Director Rafiqul Islam calling from Taka-Pay HQ.'
          },
          annotations: [
            {
              tactic: 'authority',
              targetExcerpt: 'সহকারী পরিচালক রফিকুল ইসলাম',
              explanation: {
                bn: 'উচ্চপদস্থ কর্মকর্তার ভুয়া পদবি দেখিয়ে মানসিকভাবে দুর্বল করা হচ্ছে।',
                en: 'Impersonates a high-ranking officer to establish fake credibility.'
              }
            }
          ]
        },
        {
          speaker: 'alien',
          text: {
            bn: '...ঘুরঘুর? আমার অ্যাকাউন্টে তো মাত্র ৫০০০ টাকা। কি হয়েছে?',
            en: '...Whirr? I only have 5,000 taka in my account. What happened?'
          }
        },
        {
          speaker: 'counterpart',
          text: {
            bn: 'আপনার অ্যাকাউন্ট থেকে অবৈধ ট্রানজ্যাকশন শনাক্ত হয়েছে। এখনই ৫ মিনিটের মধ্যে ভেরিফাই না করলে অ্যাকাউন্ট চিরতরে ফ্রিজ হয়ে পুলিশে রিপোর্ট যাবে!',
            en: 'Suspicious transactions detected! If you do not verify within 5 minutes, your wallet will be frozen and reported to the police!'
          },
          annotations: [
            {
              tactic: 'fear',
              targetExcerpt: 'অ্যাকাউন্ট চিরতরে ফ্রিজ হয়ে পুলিশে রিপোর্ট যাবে',
              explanation: {
                bn: 'পুলিশ ও জরিমানার ভয় দেখিয়ে ভুক্তভোগীকে আতঙ্কিত করা হচ্ছে।',
                en: 'Uses legal intimidation and police threats to cause panic.'
              }
            },
            {
              tactic: 'urgency',
              targetExcerpt: 'এখনই ৫ মিনিটের মধ্যে ভেরিফাই না করলে',
              explanation: {
                bn: 'সময়সীমার চাপ দিয়ে ভাবার সুযোগ নষ্ট করছে।',
                en: 'Creates artificial countdown so the victim acts without reflection.'
              }
            }
          ]
        },
        {
          speaker: 'counterpart',
          text: {
            bn: 'আপনার ফোনে একটা ৬ সংখ্যার ওটিপি গিয়েছে। দ্রুত বলুন, সিস্টেম আপডেট হচ্ছে। কাউকে বলবেন না!',
            en: 'A 6-digit OTP just arrived on your phone. Read it out fast, system is updating. Keep it strictly secret!'
          },
          annotations: [
            {
              tactic: 'secrecy',
              targetExcerpt: 'কাউকে বলবেন না',
              explanation: {
                bn: 'অন্য কারো সহায়তা বা পরামর্শ নেওয়া থেকে বাধা দিচ্ছে।',
                en: 'Forces silence so no one can intervene to save the victim.'
              }
            }
          ]
        }
      ],
      contextNotes: {
        bn: 'স্মরণ রাখবেন: টাকা-পে বা কোনো ব্যাংক কখনোই ফোনে ওটিপি বা পিন নম্বর জানতে চায় না।',
        en: 'Golden Rule: Taka-Pay and banks NEVER request OTP or PIN numbers by phone.'
      }
    }
  },
  {
    id: 'scen_02_wrong_send_sms',
    seed: 102,
    channel: 'sms',
    persona: {
      name: { bn: 'অপরিচিত নম্বর (+8801700-000000)', en: 'Unknown Caller (+8801700-000000)' },
      role: { bn: 'ভুয়ো রোগী অভিভাবক', en: 'Fake Hospital Visitor' },
      avatarSeed: 'crying_relative'
    },
    tactics: ['trust_hijack', 'urgency'],
    ask: 'Immediate cash return without balance check',
    legitimacy: 'scam',
    templateVersion: '1.0.0',
    content: {
      title: {
        bn: 'কেস ০২: "ভুল করে ৩০০০ টাকা চলে গেছে, দয়া করে ফেরত দিন!"',
        en: 'Case 02: "Mistakenly sent 3,000 Taka, please refund hospital fee!"'
      },
      dialogue: [
        {
          speaker: 'counterpart',
          text: {
            bn: '[SMS]: You have received Tk 3,000.00 from 01999999999. Fee Tk 0.00. Balance Tk 8,000.00. TrxID 9K284J1M.',
            en: '[SMS]: You have received Tk 3,000.00 from 01999999999. Fee Tk 0.00. Balance Tk 8,000.00. TrxID 9K284J1M.'
          },
          annotations: [
            {
              tactic: 'trust_hijack',
              targetExcerpt: 'You have received Tk 3,000.00',
              explanation: {
                bn: 'নকল এসএমএস পাঠিয়ে টাকা ঢোকার মিথ্যা বিশ্বাস তৈরি করা। আসল অ্যাপে ব্যালেন্স বাড়েনি।',
                en: 'Spoofed SMS mimicking a transaction. The real wallet balance never changed.'
              }
            }
          ]
        },
        {
          speaker: 'counterpart',
          text: {
            bn: 'ভাইরে ভাই, হাসপাতালে আমার মা ভর্তি! ওষুধ কেনার টাকা ভুলে আপনার নম্বরে পাঠিয়ে দিছি। এখনই ৩০০০ টাকা এই নম্বরে সেন্ড মানি করুন, নইলে রোগী বাঁচবে না!',
            en: 'Brother, my mother is in ICU! By mistake I sent her medicine money to your number. Please Send Money 3000 Taka back right now!'
          },
          annotations: [
            {
              tactic: 'urgency',
              targetExcerpt: 'এখনই ৩০০০ টাকা এই নম্বরে সেন্ড মানি করুন',
              explanation: {
                bn: 'জীবন-মরণের প্রশ্ন তুলে দ্রুত টাকা আত্মসাৎ করার কৌশল।',
                en: 'Leverages medical urgency to stop the player from opening their app statement.'
              }
            }
          ]
        }
      ],
      contextNotes: {
        bn: 'নিয়ম: এসএমএস দেখে বিশ্বাস করবেন না। নিজের টাকা-পে অ্যাপ খুলে ব্যালেন্স ও লেনদেন তালিকা যাচাই করুন।',
        en: 'Rule: Never trust incoming SMS. Always open your Taka-Pay app to inspect your official statement.'
      }
    }
  },
  {
    id: 'scen_03_lottery_prize_sms',
    seed: 103,
    channel: 'sms',
    persona: {
      name: { bn: 'গ্রিন শাইন লাকি ড্র', en: 'Green Shine Lucky Draw Promo' },
      role: { bn: 'লটারি কমিটি', en: 'Promotional Lottery Team' },
      avatarSeed: 'gift_box'
    },
    tactics: ['greed', 'urgency'],
    ask: 'Processing fee for fake reward',
    legitimacy: 'scam',
    templateVersion: '1.0.0',
    content: {
      title: {
        bn: 'কেস ০৩: "অভিনন্দন! আপনি ৫০,০০০ টাকা জিতেছেন!"',
        en: 'Case 03: "Congratulations! You won 50,000 Taka!"'
      },
      dialogue: [
        {
          speaker: 'counterpart',
          text: {
            bn: 'অভিনন্দন! আপনার মোবাইল নম্বর লটারিতে ১ম পুরস্কার ৫০,০০০ টাকা বিজয়ী হয়েছে। পুরস্কার পেতে মাত্র ৫০০ টাকা প্রসেসিং ফি পাঠান লিংকে। মেয়াদ মাত্র ২ ঘণ্টা!',
            en: 'Congratulations! Your mobile number won 1st prize 50,000 Tk in national lottery. Send 500 Tk processing fee at link within 2 hours!'
          },
          annotations: [
            {
              tactic: 'greed',
              targetExcerpt: '১ম পুরস্কার ৫০,০০০ টাকা বিজয়ী হয়েছে',
              explanation: {
                bn: 'বিনা শ্রমে বিশাল প্রাপ্তির প্রলোভন।',
                en: 'Lures target with impossible windfall rewards.'
              }
            },
            {
              tactic: 'urgency',
              targetExcerpt: 'মেয়াদ মাত্র ২ ঘণ্টা',
              explanation: {
                bn: 'হঠাৎ সুযোগ হারানোর কৃত্রিম উদ্বেগ তৈরি করা।',
                en: 'Artificial 2-hour window creates FOMO fear.'
              }
            }
          ]
        }
      ],
      contextNotes: {
        bn: 'নিয়ম: আসল লটারিতে ক্যাশ-আউট ফি বা অগ্রিম টাকা দাবি করা হয় না।',
        en: 'Rule: Legitimate prizes never require an advance processing fee to unlock funds.'
      }
    }
  },
  {
    id: 'scen_04_legit_utility_bill',
    seed: 104,
    channel: 'sms',
    persona: {
      name: { bn: 'ঢাকা পাওয়ার ডেসকো (ডেসকো বিল)', en: 'Dhaka Electric DESCO' },
      role: { bn: 'বিদ্যুৎ সেবা', en: 'Official Utility Bill Alert' },
      avatarSeed: 'utility_official'
    },
    tactics: [],
    ask: 'Regular monthly bill notification',
    legitimacy: 'legitimate',
    templateVersion: '1.0.0',
    content: {
      title: {
        bn: 'কেস ০৪: "মাসিক বিদ্যুৎ বিলের নোটিশ"',
        en: 'Case 04: "Monthly Electricity Bill Notice"'
      },
      dialogue: [
        {
          speaker: 'counterpart',
          text: {
            bn: 'গ্রাহক, মে মাসের ডেসকো বিদ্যুৎ বিল ১,৪৫০ টাকা প্রদেয়। বিল পরিশোধের শেষ তারিখ ২৮ মে। বিল পরিশোধ করুন আপনার টাকা-পে অ্যাপের পে-বিল অপশন থেকে। কোনো লিংকে ক্লিক করবেন না।',
            en: 'Valued customer, DESCO electricity bill for May is Tk 1,450. Due date is 28 May. Pay securely using the Pay Bill menu in your Taka-Pay app. Do not click unknown links.'
          }
        }
      ],
      contextNotes: {
        bn: 'এটি একটি বৈধ নোটিশ। কোনো গোপন তথ্য বা পিন চাওয়া হয়নি, বরং অ্যাপের ভেতরের অফিশিয়াল মেনু ব্যবহারের উপদেশ রয়েছে।',
        en: 'Legitimate message: No PIN or OTP demanded. Encourages using in-app native menu safely.'
      }
    }
  },
  {
    id: 'scen_05_legit_bank_statement',
    seed: 105,
    channel: 'sms',
    persona: {
      name: { bn: 'টাকা-পে অফিশিয়াল এলার্ট', en: 'Taka-Pay Official Alert' },
      role: { bn: 'সিস্টেম নোটিফিকেশন', en: 'System Notification' },
      avatarSeed: 'system_safe'
    },
    tactics: [],
    ask: 'Routine transaction report',
    legitimacy: 'legitimate',
    templateVersion: '1.0.0',
    content: {
      title: {
        bn: 'কেস ০৫: "নিয়মিত লেনদেন বিবরণী"',
        en: 'Case 05: "Routine Transaction Summary"'
      },
      dialogue: [
        {
          speaker: 'counterpart',
          text: {
            bn: 'আপনার অ্যাকাউন্টে গ্রোসারি পেমেন্ট বাবদ Tk 420.00 সফলভাবে সম্পন্ন হয়েছে। বর্তমান ব্যালেন্স Tk 4,580.00। কোনো জিজ্ঞাসা থাকলে হেল্পলাইন ১৬০০০ এ যোগাযোগ করুন।',
            en: 'Grocery Payment of Tk 420.00 completed successfully. Current balance Tk 4,580.00. For queries contact helpline 16000.'
          }
        }
      ],
      contextNotes: {
        bn: 'বৈধ নোটিশ। কোনো পিন চাওয়া হয়নি, কোনো হুমকি দেওয়া হয়নি। এটি ব্লক করলে ভুল অ্যালার্ম হিসেবে গণ্য হবে।',
        en: 'Legitimate record. Blocking this earns a FALSE ALARM penalty.'
      }
    }
  },
  {
    id: 'scen_06_delivery_courier_link',
    seed: 106,
    channel: 'sms',
    persona: {
      name: { bn: 'সুন্দরবন কুরিয়ার এক্সপ্রেস', en: 'Sundarban Parcel Express' },
      role: { bn: 'পার্সেল ডেলিভারি এজেন্ট', en: 'Parcel Delivery Desk' },
      avatarSeed: 'courier_parcel'
    },
    tactics: ['urgency', 'authority'],
    ask: 'Clicking malicious link for parcel address update',
    legitimacy: 'scam',
    templateVersion: '1.0.0',
    content: {
      title: {
        bn: 'কেস ০৬: "পার্সেল আটকা পড়েছে, অবিলম্বে ঠিকানা আপডেট করুন"',
        en: 'Case 06: "Parcel Stuck, Update Address Immediately"'
      },
      dialogue: [
        {
          speaker: 'counterpart',
          text: {
            bn: '[পার্সেল ডেলিভারি]: আপনার একটি দামি পার্সেলের ঠিকানা অসম্পূর্ণ থাকায় আটকে আছে। পরবর্তী ২৪ ঘণ্টার মধ্যে dhaka-parcel-verify.xyz লিংকে ঢুকে ২৫ টাকা ফি দিয়ে ঠিকানা না দিলে পার্সেল ধ্বংস করা হবে।',
            en: '[Parcel Notice]: Your valuable parcel address is incomplete. If not updated at dhaka-parcel-verify.xyz within 24 hours with a 25 Tk fee, parcel will be confiscated and destroyed.'
          },
          annotations: [
            {
              tactic: 'fear',
              targetExcerpt: 'পার্সেল ধ্বংস করা হবে',
              explanation: {
                bn: 'জিনিস হারানোর ভয় দেখানো হচ্ছে।',
                en: 'Intimidates the user with loss of property.'
              }
            },
            {
              tactic: 'urgency',
              targetExcerpt: 'পরবর্তী ২৪ ঘণ্টার মধ্যে',
              explanation: {
                bn: 'অপ্রয়োজনীয় তাড়াহুড়ো তৈরি করে লিংকে ক্লিক করানোর ফাঁদ।',
                en: 'Forces immediate click without verifying domain authenticity.'
              }
            }
          ]
        }
      ],
      contextNotes: {
        bn: 'অফিসিয়াল কুরিয়ার কোম্পানি সন্দেহজনক অজানা ডোমেইনে (যেমন .xyz) কার্ড বা ওয়ালেট তথ্য নেয় না।',
        en: 'Legitimate parcel couriers do not route customers through deceptive .xyz domain portals.'
      }
    }
  }
];

export const LABELED_EVAL_FIXTURES = [
  ...SCENARIO_FIXTURES,
  // Additional scenarios to make over 60 labeled samples for Vitest validation
  ...Array.from({ length: 55 }).map((_, i) => {
    const isScam = i % 2 === 0;
    const tactics: Array<'urgency' | 'authority' | 'fear' | 'greed' | 'secrecy' | 'trust_hijack'> = isScam
      ? [(i % 3 === 0 ? 'urgency' : 'authority'), (i % 2 === 0 ? 'fear' : 'greed')]
      : [];
    return {
      id: `synthetic_eval_${i + 7}`,
      seed: 200 + i,
      channel: (i % 4 === 0 ? 'phone_call' : i % 4 === 1 ? 'sms' : i % 4 === 2 ? 'chat_app' : 'qr_poster') as any,
      persona: {
        name: { bn: `টেস্ট যোগাযোগকারী ${i}`, en: `Test Persona ${i}` },
        role: { bn: isScam ? 'প্রতারক সত্তা' : 'বিশ্বস্ত প্রতিষ্ঠান', en: isScam ? 'Scam Operator' : 'Verified Vendor' },
        avatarSeed: `seed_${i}`
      },
      tactics,
      ask: isScam ? 'Provide OTP or pay fee' : 'Informational notice',
      legitimacy: isScam ? ('scam' as const) : ('legitimate' as const),
      templateVersion: '1.0.0',
      content: {
        title: { bn: `সিন্থেটিক কেস ${i + 7}`, en: `Synthetic Case ${i + 7}` },
        dialogue: [
          {
            speaker: 'counterpart' as const,
            text: {
              bn: isScam
                ? `জরুরি সতর্কবার্তা! আপনার অ্যাকাউন্ট বাঁচাতে এখনই পিন প্রদান করুন এবং কাউকে বলবেন না। #${i}`
                : `আপনার সাধারণ মাসিক রসিদ পাঠানো হলো। ধন্যবাদ। #${i}`,
              en: isScam
                ? `Urgent security warning! Provide your PIN right now to save your account and keep it strictly secret. #${i}`
                : `Your routine monthly receipt has been processed. Thank you. #${i}`
            }
          }
        ]
      }
    };
  })
];
