import { ScamTactic, TACTIC_DEFINITIONS } from '@antibody/shared';

export interface ClassificationResult {
  isScam: boolean;
  confidence: number;
  detectedTactics: ScamTactic[];
  reasons: { bn: string; en: string }[];
  antibodyGuidance: { bn: string; en: string };
}

export class ScamCoach {
  // Pattern matching rules for Bangla & English scam cues
  public classifyMessage(text: string): ClassificationResult {
    const lower = text.toLowerCase();
    const detected = new Set<ScamTactic>();
    const reasons: { bn: string; en: string }[] = [];

    // Urgency indicators
    if (
      lower.includes('এখনই') ||
      lower.includes('তাড়াতাড়ি') ||
      lower.includes('দ্রুত') ||
      lower.includes('urgent') ||
      lower.includes('immediate') ||
      lower.includes('within') ||
      lower.includes('মিনিট') ||
      lower.includes('ঘণ্টা')
    ) {
      detected.add('urgency');
      reasons.push({
        bn: 'তাড়াহুড়ো ও সময়সীমার কৃত্রিম চাপ দেওয়া হয়েছে।',
        en: 'Artificial time crunch and urgency pressure detected.'
      });
    }

    // Authority indicators
    if (
      lower.includes('ম্যানেজার') ||
      lower.includes('অফিসার') ||
      lower.includes('ইন্সপেক্টর') ||
      lower.includes('পুলিশ') ||
      lower.includes('হেড অফিস') ||
      lower.includes('official') ||
      lower.includes('headquarters') ||
      lower.includes('director')
    ) {
      detected.add('authority');
      reasons.push({
        bn: 'কর্তৃত্বপূর্ণ পদ বা ভুয়া অফিসিয়াল রূপ ধারণ করা হয়েছে।',
        en: 'Claiming authoritative official title or police authority.'
      });
    }

    // Fear indicators
    if (
      lower.includes('ব্লক') ||
      lower.includes('ফ্রিজ') ||
      lower.includes('জব্দ') ||
      lower.includes('মামলা') ||
      lower.includes('ধ্বংস') ||
      lower.includes('suspend') ||
      lower.includes('freeze') ||
      lower.includes('legal action')
    ) {
      detected.add('fear');
      reasons.push({
        bn: 'অ্যাকাউন্ট জব্দ বা শাস্তির ভয় দেখানো হয়েছে।',
        en: 'Intimidation of account suspension or penalties.'
      });
    }

    // Greed indicators
    if (
      lower.includes('লটারি') ||
      lower.includes('পুরস্কার') ||
      lower.includes('জিতেছেন') ||
      lower.includes('বোনাস') ||
      lower.includes('won') ||
      lower.includes('lottery') ||
      lower.includes('prize') ||
      lower.includes('reward')
    ) {
      detected.add('greed');
      reasons.push({
        bn: 'অবাস্তব পুরস্কার বা লটারির প্রলোভন দেওয়া হয়েছে।',
        en: 'Windfall prize or unrealistic lottery bait observed.'
      });
    }

    // Secrecy indicators
    if (
      lower.includes('কাউকে বলবেন না') ||
      lower.includes('গোপন') ||
      lower.includes('secret') ||
      lower.includes('confidential') ||
      lower.includes('do not share') ||
      lower.includes('do not tell')
    ) {
      detected.add('secrecy');
      reasons.push({
        bn: 'পরিবার বা ব্যাংক প্রতিনিধিদের কাছ থেকে তথ্য লুকানোর নির্দেশ রয়েছে।',
        en: 'Instruction to keep secrets from relatives or branch officers.'
      });
    }

    // Trust hijack / OTP request
    if (
      lower.includes('ওটিপি') ||
      lower.includes('পিন') ||
      lower.includes('otp') ||
      lower.includes('pin') ||
      lower.includes('ভুল করে') ||
      lower.includes('mistakenly') ||
      lower.includes('refund')
    ) {
      detected.add('trust_hijack');
      reasons.push({
        bn: 'গোপন ওটিপি চাওয়া হয়েছে অথবা ভুয়া ভুলের কথা বলে টাকা দাবি করা হয়েছে।',
        en: 'Sensitive OTP requested or fraudulent refund demanded.'
      });
    }

    const tacticsList = Array.from(detected);
    const isScam = tacticsList.length > 0;
    const confidence = isScam ? Math.min(0.5 + tacticsList.length * 0.2, 0.98) : 0.95;

    let guidanceBn = 'সতর্কতা: কোনো সন্দেহ হলে কল কেটে দিন এবং নিজের অ্যাপ থেকে সাহায্য নিন।';
    let guidanceEn = 'Warning: When in doubt, hang up and consult the official helpline.';

    if (tacticsList.length > 0) {
      const primaryTactic = tacticsList[0];
      guidanceBn = TACTIC_DEFINITIONS[primaryTactic].antibodyRule.action.bn;
      guidanceEn = TACTIC_DEFINITIONS[primaryTactic].antibodyRule.action.en;
    }

    return {
      isScam,
      confidence,
      detectedTactics: tacticsList,
      reasons,
      antibodyGuidance: { bn: guidanceBn, en: guidanceEn }
    };
  }

  public async explainWithCoach(userQuery: string): Promise<{
    explanation: { bn: string; en: string };
    detectedTactics: ScamTactic[];
    disclaimer: { bn: string; en: string };
  }> {
    // Deterministic rule-based response with grounded reasoning
    const analysis = this.classifyMessage(userQuery);

    let bnExp = '';
    let enExp = '';

    if (analysis.isScam) {
      bnExp = `সতর্ক হোন! এই বার্তাটিতে প্রতারণার লক্ষণ স্পষ্ট। লক্ষণসমূহ: ${analysis.reasons.map((r) => r.bn).join(' ')} \n\nপ্রতিরোধ কৌশল: ${analysis.antibodyGuidance.bn}`;
      enExp = `Caution! This message displays clear scam markers. Indicators: ${analysis.reasons.map((r) => r.en).join(' ')} \n\nAntibody Defense: ${analysis.antibodyGuidance.en}`;
    } else {
      bnExp = `এই বার্তাটিতে সাধারণ প্রাতিষ্ঠানিক যোগাযোগ দেখা যাচ্ছে। কোনো জরুরি পিন বা অর্থ দাবি করা হয়নি। তবুও যেকোনো লিংকে প্রবেশের আগে অফিশিয়াল ওয়েবসাইট মিলিয়ে নিন।`;
      enExp = `This appears to be routine communication without overt extortion or credential theft. However, always verify domains before entering credentials.`;
    }

    return {
      explanation: { bn: bnExp, en: enExp },
      detectedTactics: analysis.detectedTactics,
      disclaimer: {
        bn: 'অনুস্মারক: সন্দেহের উদ্রেক হলে সাথে সাথে লাইন কেটে দিন এবং অফিশিয়াল হেল্পলাইনে নিজ থেকে ফোন দিন।',
        en: 'Golden Reminder: When in doubt, hang up and dial the bank’s verified helpline yourself.'
      }
    };
  }
}
