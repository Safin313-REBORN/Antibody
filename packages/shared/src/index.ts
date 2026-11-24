import { z } from 'zod';

export const ScamTacticEnum = z.enum([
  'urgency',
  'authority',
  'fear',
  'greed',
  'secrecy',
  'trust_hijack'
]);
export type ScamTactic = z.infer<typeof ScamTacticEnum>;

export interface TacticDefinition {
  id: ScamTactic;
  name: { bn: string; en: string };
  badge: { bn: string; en: string };
  description: { bn: string; en: string };
  pathogenName: string;
  color: string;
  antibodyRule: {
    id: string;
    action: { bn: string; en: string };
    mnemonic: { bn: string; en: string };
  };
}

export const TACTIC_DEFINITIONS: Record<ScamTactic, TacticDefinition> = {
  urgency: {
    id: 'urgency',
    name: { bn: 'তাড়াহুড়ো / জরুরি ভাব', en: 'Urgency Pressure' },
    badge: { bn: 'তাড়াহুড়ো', en: 'URGENCY' },
    description: {
      bn: 'সময় নেই বলে অবিলম্বে সিদ্ধান্ত নিতে বাধ্য করা।',
      en: 'Forces immediate action by claiming time is running out.'
    },
    pathogenName: 'Accelerococcus velox',
    color: '#E4422B',
    antibodyRule: {
      id: 'rule_urgency',
      action: {
        bn: 'বিরতি নিন। ১০ মিনিট অপেক্ষা করুন। আসল সংস্থায় নিজ থেকে কল করুন।',
        en: 'Pause. Wait 10 minutes. Call the official number back yourself.'
      },
      mnemonic: {
        bn: 'জরুরি বললেই থামুন—ধীরেসুস্থে যাচাই করুন',
        en: 'Urgency is a trap—slow down and verify'
      }
    }
  },
  authority: {
    id: 'authority',
    name: { bn: 'ভুয়ো কর্তৃত্ব / পদমর্যাদা', en: 'Fake Authority' },
    badge: { bn: 'কর্তৃত্ব', en: 'AUTHORITY' },
    description: {
      bn: 'ব্যাংক ম্যানেজার, পুলিশ বা কর্মকর্তার পরিচয় দিয়ে আদেশ জারি করা।',
      en: 'Impersonates officials, police, or bank managers to command obedience.'
    },
    pathogenName: 'Authoribacter regis',
    color: '#E9A800',
    antibodyRule: {
      id: 'rule_authority',
      action: {
        bn: 'পদ নয়, চ্যানেল যাচাই করুন। ব্যাংক কখনো ফোনে পিন বা ওটিপি চায় না।',
        en: 'Verify the channel, not the title. Banks never ask for PIN or OTP over phone.'
      },
      mnemonic: {
        bn: 'বড় সাহেব বললেই বিশ্বাস নয়—অফিসিয়াল ব্রাঞ্চে চলুন',
        en: 'Titles lie—official numbers do not'
      }
    }
  },
  fear: {
    id: 'fear',
    name: { bn: 'ভীতি প্রদর্শন / অ্যাকাউন্ট ব্লক', en: 'Fear & Threats' },
    badge: { bn: 'ভীতি', en: 'FEAR' },
    description: {
      bn: 'অ্যাকাউন্ট জব্দ, আইনি নোটিশ বা জেল-জরিমানার ভয় দেখানো।',
      en: 'Threatens frozen accounts, police reports, or legal ruin.'
    },
    pathogenName: 'Terrorbacillus toxis',
    color: '#E4422B',
    antibodyRule: {
      id: 'rule_fear',
      action: {
        bn: 'আতঙ্কিত হবেন না। কোনো সঠিক সেবা তাৎক্ষণিক ব্লক নোটিশে পিন চায় না।',
        en: 'Do not panic. Legitimate services do not demand PIN to avoid suspension.'
      },
      mnemonic: {
        bn: 'ভয় দেখানো মানেই ফাঁদ',
        en: 'Fear induces blindness; breathe and check'
      }
    }
  },
  greed: {
    id: 'greed',
    name: { bn: 'লোভনীয় অফার / লটারি', en: 'Greed & Windfalls' },
    badge: { bn: 'লোভনীয় লাভ', en: 'GREED' },
    description: {
      bn: 'বিনা কষ্টে লাখ টাকার লটারি বা অস্বাভাবিক মুনাফার টোপ ফেলা।',
      en: 'Promises miraculous cash rewards, fake prizes, or high-yield returns.'
    },
    pathogenName: 'Avaritiella aureus',
    color: '#E9A800',
    antibodyRule: {
      id: 'rule_greed',
      action: {
        bn: 'যে লটারি কেনেননি, তা আপনি জেতেননি। ক্যাশ-আউটের ফি চাওয়াটাই বাটপাড়ি।',
        en: 'You cannot win a contest you never entered. Fee-to-claim is guaranteed fraud.'
      },
      mnemonic: {
        bn: 'বিনা শ্রমে টাকা নেই',
        en: 'Free money always costs everything'
      }
    }
  },
  secrecy: {
    id: 'secrecy',
    name: { bn: 'গোপনীয়তার শপথ / আড়াল করা', en: 'Forced Secrecy' },
    badge: { bn: 'গোপনীয়তা', en: 'SECRECY' },
    description: {
      bn: 'কাউকে বলতে নিষেধ করা, পরিবারের কাছে লুকানোর নির্দেশ দেওয়া।',
      en: 'Demands absolute silence from family, friends, or branch agents.'
    },
    pathogenName: 'Cryptococcus isolatus',
    color: '#14231F',
    antibodyRule: {
      id: 'rule_secrecy',
      action: {
        bn: 'কাউকে বলতে মানা করা মানেই বড় প্রতারণা চলছে। সাথে সাথে কাউকে জানান।',
        en: 'Forced silence is the biggest red flag. Always consult a second human.'
      },
      mnemonic: {
        bn: 'লুকাতে বললেই বিপদ—সবাইকে জানান',
        en: 'Secrecy hides the predator'
      }
    }
  },
  trust_hijack: {
    id: 'trust_hijack',
    name: { bn: 'বিশ্বাস অপহরণ / ভুল রিফান্ড', en: 'Trust Hijack' },
    badge: { bn: 'সহানুভূতি / আস্থা', en: 'TRUST HIJACK' },
    description: {
      bn: 'ভুল করে টাকা পাঠিয়েছি বলে আবেগ ও সহমর্মিতার সুযোগ নেওয়া।',
      en: 'Claims accidental money sent, or mimics trusted family/friends.'
    },
    pathogenName: 'Parasympathia fallax',
    color: '#0E7C7B',
    antibodyRule: {
      id: 'rule_trust_hijack',
      action: {
        bn: 'এসএমএস নয়, নিজের অ্যাপে ব্যালেন্স চেক করুন। টাকা নিজে ফেরত পাঠাবেন না, হেল্পলাইনে বলুন।',
        en: 'Never trust SMS balance. Check app statement. Let customer support reverse it.'
      },
      mnemonic: {
        bn: 'কথায় নয়—ব্যালেন্স স্টেটমেন্টে বিশ্বাস রাখুন',
        en: 'SMS is cheap; app statement is truth'
      }
    }
  }
};

export const ScenarioChannelEnum = z.enum(['phone_call', 'sms', 'chat_app', 'qr_poster']);
export type ScenarioChannel = z.infer<typeof ScenarioChannelEnum>;

export interface ScenarioAnnotation {
  tactic: ScamTactic;
  targetExcerpt: string;
  explanation: { bn: string; en: string };
  offset?: [number, number];
}

export interface Scenario {
  id: string;
  seed: number;
  channel: ScenarioChannel;
  persona: {
    name: { bn: string; en: string };
    role: { bn: string; en: string };
    avatarSeed: string;
  };
  tactics: ScamTactic[];
  ask: string;
  legitimacy: 'scam' | 'legitimate';
  templateVersion: string;
  content: {
    title: { bn: string; en: string };
    dialogue: Array<{
      speaker: 'alien' | 'counterpart';
      text: { bn: string; en: string };
      annotations?: ScenarioAnnotation[];
    }>;
    contextNotes?: { bn: string; en: string };
  };
}

export interface AgentProfile {
  id: string;
  callsign: string;
  avatar: string;
  isGuest: boolean;
  createdAt: string;
  lastSeenAt: string;
}

export interface SusceptibilityScore {
  tactic: ScamTactic;
  alpha: number;
  beta: number;
  score: number; // 0 to 100
  encounters: number;
}

export interface DashboardMetrics {
  agent: AgentProfile;
  totalAttempts: number;
  correctCatches: number;
  falseAlarms: number;
  accuracyRate: number;
  streak: number;
  susceptibility: Record<ScamTactic, SusceptibilityScore>;
  recentAttempts: Array<{
    scenarioId: string;
    legitimacy: 'scam' | 'legitimate';
    playerAction: 'block' | 'allow' | 'challenge';
    correct: boolean;
    tactics: ScamTactic[];
    timestamp: string;
  }>;
}
export * from './fixtures.js';
