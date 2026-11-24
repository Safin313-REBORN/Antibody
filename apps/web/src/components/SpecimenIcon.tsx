import React from 'react';
import { ScamTactic } from '@antibody/shared';

interface SpecimenIconProps {
  tactic: ScamTactic;
  size?: number;
  className?: string;
}

export const SpecimenIcon: React.FC<SpecimenIconProps> = ({ tactic, size = 36, className = '' }) => {
  switch (tactic) {
    case 'urgency':
      // Accelerococcus: spiky clock pathogen
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" className={className}>
          <circle cx="20" cy="20" r="13" fill="#FBEAE7" stroke="#E4422B" strokeWidth="2.5" />
          <path d="M 20 7 L 20 12 M 20 28 L 20 33 M 7 20 L 12 20 M 28 20 L 33 20" stroke="#E4422B" strokeWidth="2" strokeLinecap="round" />
          <path d="M 20 20 L 20 13 M 20 20 L 25 24" stroke="#14231F" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
    case 'authority':
      // Authoribacter: crown / military badge spore
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" className={className}>
          <polygon points="20,8 24,16 33,16 26,22 29,31 20,25 11,31 14,22 7,16 16,16" fill="#FFF7DE" stroke="#E9A800" strokeWidth="2.5" />
          <circle cx="20" cy="20" r="3" fill="#14231F" />
        </svg>
      );
    case 'fear':
      // Terrorbacillus: skull hazard blob
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" className={className}>
          <path d="M 12 16 C 12 10, 28 10, 28 16 C 28 23, 24 25, 24 29 L 16 29 C 16 25, 12 23, 12 16 Z" fill="#FBEAE7" stroke="#E4422B" strokeWidth="2.5" />
          <circle cx="17" cy="17" r="2" fill="#14231F" />
          <circle cx="23" cy="17" r="2" fill="#14231F" />
          <path d="M 18 25 L 22 25" stroke="#14231F" strokeWidth="2" />
        </svg>
      );
    case 'greed':
      // Avaritiella: gleaming coin bacterium
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" className={className}>
          <circle cx="20" cy="20" r="14" fill="#FFF7DE" stroke="#E9A800" strokeWidth="2.5" strokeDasharray="3 2" />
          <circle cx="20" cy="20" r="9" fill="none" stroke="#14231F" strokeWidth="1.5" />
          <text x="20" y="24" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#14231F" fontFamily="IBM Plex Mono">৳</text>
        </svg>
      );
    case 'secrecy':
      // Cryptococcus: blindfold lock organism
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" className={className}>
          <rect x="12" y="16" width="16" height="14" rx="3" fill="#E8EDEB" stroke="#14231F" strokeWidth="2.5" />
          <path d="M 16 16 L 16 12 C 16 9.5, 24 9.5, 24 12 L 24 16" fill="none" stroke="#14231F" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="20" cy="23" r="2" fill="#E4422B" />
        </svg>
      );
    case 'trust_hijack':
      // Parasympathia: masked heart parasite
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" className={className}>
          <path d="M 20 29 C 14 23, 8 18, 12 12 C 15 8, 20 12, 20 15 C 20 12, 25 8, 28 12 C 32 18, 26 23, 20 29 Z" fill="#E2F2F2" stroke="#0E7C7B" strokeWidth="2.5" />
          <path d="M 11 15 L 29 19" stroke="#E4422B" strokeWidth="2" strokeDasharray="2 2" />
        </svg>
      );
  }
};
