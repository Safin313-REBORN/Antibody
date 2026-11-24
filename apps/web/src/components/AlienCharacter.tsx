import React from 'react';

export type AlienMood = 'curious' | 'trusting' | 'confused' | 'panicked' | 'relieved' | 'proud';

interface AlienProps {
  mood?: AlienMood;
  size?: number;
  className?: string;
  hasAntibody?: boolean;
}

export const AlienCharacter: React.FC<AlienProps> = ({
  mood = 'curious',
  size = 160,
  className = '',
  hasAntibody = false
}) => {
  // Antenna angle calculations based on emotion
  let leftAntennaRot = 0;
  let rightAntennaRot = 0;
  let eyeScale = 1.0;
  let mouthPath = 'M 44 68 Q 50 72 56 68'; // small neutral smile

  if (mood === 'trusting') {
    leftAntennaRot = 8;
    rightAntennaRot = -8;
    mouthPath = 'M 42 66 Q 50 76 58 66';
  } else if (mood === 'panicked') {
    leftAntennaRot = -25;
    rightAntennaRot = 25;
    eyeScale = 1.25;
    mouthPath = 'M 45 74 Q 50 64 55 74'; // droop mouth
  } else if (mood === 'confused') {
    leftAntennaRot = -15;
    rightAntennaRot = 5;
    mouthPath = 'M 44 69 Q 49 67 56 71';
  } else if (mood === 'relieved' || mood === 'proud') {
    leftAntennaRot = 12;
    rightAntennaRot = -12;
    mouthPath = 'M 40 64 Q 50 80 60 64';
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`transition-all duration-300 ${className}`}
      role="img"
      aria-label={`Alien character expressing ${mood}`}
    >
      {/* Dropshadow ink blot */}
      <ellipse cx="50" cy="94" rx="28" ry="4.5" fill="#14231F" opacity="0.3" />

      {/* Left Antenna */}
      <g style={{ transformOrigin: '40px 35px', transform: `rotate(${leftAntennaRot}deg)` }} className="transition-transform duration-300">
        <path
          d="M 40 35 C 36 20, 28 12, 24 6"
          stroke="#14231F"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <circle cx="24" cy="6" r="4.5" fill="#E9A800" stroke="#14231F" strokeWidth="2.5" />
      </g>

      {/* Right Antenna */}
      <g style={{ transformOrigin: '60px 35px', transform: `rotate(${rightAntennaRot}deg)` }} className="transition-transform duration-300">
        <path
          d="M 60 35 C 64 20, 72 12, 76 6"
          stroke="#14231F"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <circle cx="76" cy="6" r="4.5" fill="#E9A800" stroke="#14231F" strokeWidth="2.5" />
      </g>

      {/* Head / Body Egg Shape */}
      <ellipse
        cx="50"
        cy="55"
        rx="26"
        ry="30"
        fill="#A3D9C9"
        stroke="#14231F"
        strokeWidth="3.5"
      />

      {/* Subtle paper / cell contour lines */}
      <path
        d="M 32 45 C 30 55, 33 65, 36 72"
        stroke="#14231F"
        strokeWidth="1.5"
        strokeDasharray="2 3"
        opacity="0.6"
      />

      {/* Left Big Reflective Eye */}
      <g style={{ transformOrigin: '40px 50px', transform: `scale(${eyeScale})` }}>
        <ellipse cx="40" cy="50" rx="6" ry="8" fill="#14231F" />
        <circle cx="38" cy="47" r="2.2" fill="#F3EBDD" />
        <circle cx="42" cy="52" r="1" fill="#F3EBDD" />
      </g>

      {/* Right Big Reflective Eye */}
      <g style={{ transformOrigin: '60px 50px', transform: `scale(${eyeScale})` }}>
        <ellipse cx="60" cy="50" rx="6" ry="8" fill="#14231F" />
        <circle cx="58" cy="47" r="2.2" fill="#F3EBDD" />
        <circle cx="62" cy="52" r="1" fill="#F3EBDD" />
      </g>

      {/* Hand-drawn Mouth */}
      <path
        d={mouthPath}
        stroke="#14231F"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Rose Alien Cheek Accents */}
      <ellipse cx="32" cy="58" rx="3.5" ry="2" fill="#D94F8A" opacity="0.6" />
      <ellipse cx="68" cy="58" rx="3.5" ry="2" fill="#D94F8A" opacity="0.6" />

      {/* 3-Fingered Hand Left */}
      <path
        d="M 24 64 C 18 64, 16 68, 18 72 M 16 68 L 22 70 M 17 73 L 23 71"
        stroke="#14231F"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* 3-Fingered Hand Right */}
      <path
        d="M 76 64 C 82 64, 84 68, 82 72 M 84 68 L 78 70 M 83 73 L 77 71"
        stroke="#14231F"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Teal Antibody Shield Markings on Chest */}
      {hasAntibody && (
        <g className="animate-pulse">
          <circle cx="50" cy="74" r="6" fill="#0E7C7B" stroke="#14231F" strokeWidth="2" />
          <path d="M 47 74 L 49 76 L 54 72" stroke="#F3EBDD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      )}
    </svg>
  );
};
