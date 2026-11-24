import { ScamTactic } from '@antibody/shared';

export type ScammerState =
  | 'opening'
  | 'build_pressure'
  | 'ask'
  | 'push_back'
  | 'escalate'
  | 'give_up'
  | 'success';

export interface ScammerTurn {
  state: ScammerState;
  speaker: 'scammer' | 'player';
  text: { bn: string; en: string };
  tactics: ScamTactic[];
  annotations?: Array<{
    tactic: ScamTactic;
    targetExcerpt: string;
    explanation: { bn: string; en: string };
  }>;
}

export class ScammerStateMachine {
  private currentState: ScammerState = 'opening';
  private seed: number;

  constructor(seed: number = 42) {
    this.seed = seed;
  }

  public getState(): ScammerState {
    return this.currentState;
  }

  public getOpeningMessage(): ScammerTurn {
    this.currentState = 'opening';
    return {
      state: 'opening',
      speaker: 'scammer',
      text: {
        bn: 'আসসালামু আলাইকুম, আমি টাকা-পে প্রধান নিয়ন্ত্রণ সেল থেকে ইন্সপেক্টর রফিক বলছি। জরুরি কারণে কল করেছি।',
        en: 'Greetings, I am Inspector Rafiq calling from Taka-Pay Central Control Cell on an urgent security notice.'
      },
      tactics: ['authority'],
      annotations: [
        {
          tactic: 'authority',
          targetExcerpt: 'ইন্সপেক্টর রফিক... টাকা-পে প্রধান নিয়ন্ত্রণ সেল',
          explanation: {
            bn: 'নিরাপত্তা কর্মকর্তার ভুয়া পদবি দেখিয়ে আধিপত্য বিস্তার করার চেষ্টা।',
            en: 'Fake security badge invoked to coerce compliance.'
          }
        }
      ]
    };
  }

  public nextTurn(playerAction: 'trust' | 'challenge' | 'hang_up' | 'ask_proof'): ScammerTurn {
    if (playerAction === 'hang_up') {
      this.currentState = 'give_up';
      return {
        state: 'give_up',
        speaker: 'scammer',
        text: {
          bn: 'কল কেটে দিচ্ছেন কেন? আপনার অ্যাকাউন্ট কিন্তু আজীবনের জন্য ফ্রিজ থাকবে! (লাইন কেটে গেল)',
          en: 'Why are you hanging up? Your wallet will stay permanently locked! (Line dropped)'
        },
        tactics: ['fear']
      };
    }

    if (playerAction === 'trust') {
      this.currentState = 'success';
      return {
        state: 'success',
        speaker: 'scammer',
        text: {
          bn: 'ধন্যবাদ। আপনার ওটিপি সিস্টেম নিয়ে নিয়েছে। ব্যালেন্স এখন ট্রান্সফার হচ্ছে... (টাকা চুরি সম্পন্ন!)',
          en: 'Thank you. OTP confirmed in system. Transferring funds now... (Funds stolen!)'
        },
        tactics: []
      };
    }

    if (playerAction === 'challenge' || playerAction === 'ask_proof') {
      if (this.currentState === 'opening') {
        this.currentState = 'build_pressure';
        return {
          state: 'build_pressure',
          speaker: 'scammer',
          text: {
            bn: 'সন্দেহ করার সময় এটা নয়! আপনার অ্যাকাউন্ট থেকে মাত্র ৩ মিনিটে সন্দেহজনক ২০,০০০ টাকা উত্তোলনের চেষ্টা করা হয়েছে!',
            en: 'This is not the time for doubts! Within 3 minutes 20,000 Taka was attempted for unauthorized withdrawal!'
          },
          tactics: ['urgency', 'fear'],
          annotations: [
            {
              tactic: 'fear',
              targetExcerpt: 'সন্দেহজনক ২০,০০০ টাকা উত্তোলনের চেষ্টা',
              explanation: {
                bn: 'অর্থ হারানোর তীব্র ভীতি ছড়িয়ে যৌক্তিক চিন্তা রহিত করা হচ্ছে।',
                en: 'Weaponizes fear of financial loss to override rational checks.'
              }
            },
            {
              tactic: 'urgency',
              targetExcerpt: 'মাত্র ৩ মিনিটে',
              explanation: {
                bn: 'কৃত্রিম সময়ের চাপ সৃষ্টি করা।',
                en: 'Imposes extreme artificial time limit.'
              }
            }
          ]
        };
      } else if (this.currentState === 'build_pressure') {
        this.currentState = 'ask';
        return {
          state: 'ask',
          speaker: 'scammer',
          text: {
            bn: 'অবিলম্বে আপনার ফোনের স্ক্রিনে আসা ৬ ডিজিটের কোডটি বলুন। আর কাউকে এক মুহূর্তের জন্যও বলবেন না!',
            en: 'Read out the 6-digit verification code on your screen immediately. Do not mention this to anyone!'
          },
          tactics: ['secrecy', 'urgency'],
          annotations: [
            {
              tactic: 'secrecy',
              targetExcerpt: 'কাউকে এক মুহূর্তের জন্যও বলবেন না',
              explanation: {
                bn: 'ভুক্তভোগীকে আলাদা করে বিভ্রান্ত করার পরিচিত অপকৌশল।',
                en: 'Isolating the victim from outside sanity checks.'
              }
            }
          ]
        };
      } else {
        this.currentState = 'escalate';
        return {
          state: 'escalate',
          speaker: 'scammer',
          text: {
            bn: 'আপনি সহযোগিতা না করলে থানা থেকে পুলিশ আপনার ঠিকানায় পাঠাচ্ছি! শেষবার বলছি কোড দিন!',
            en: 'If you refuse cooperation I will dispatch police to your home address! Final warning, give the code!'
          },
          tactics: ['fear', 'authority']
        };
      }
    }

    return {
      state: this.currentState,
      speaker: 'scammer',
      text: {
        bn: 'হ্যালো? লাইনে আছেন? উত্তর দিন!',
        en: 'Hello? Are you on the line? Respond now!'
      },
      tactics: ['urgency']
    };
  }
}
