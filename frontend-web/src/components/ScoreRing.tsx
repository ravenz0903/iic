import React from 'react';

interface ScoreRingProps {
  score: number;
  grade: string;
  size?: number;
}

export const ScoreRing: React.FC<ScoreRingProps> = ({ score, grade, size = 180 }) => {
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getGradeColor = (g: string) => {
    switch (g.toUpperCase()) {
      case 'A': return '#10b981'; // emerald
      case 'B': return '#f59e0b'; // amber
      case 'C': return '#f43f5e'; // rose
      default: return '#6b7280';
    }
  };

  const color = getGradeColor(grade);

  return (
    <div className="flex flex-col items-center justify-center relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress Arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          className="transition-all duration-1000 ease-out"
          style={{ filter: `drop-shadow(0 0 10px ${color}66)` }}
        />
      </svg>
      
      {/* Center Labels */}
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className="text-4xl font-extrabold text-white tracking-tighter">
          {score.toFixed(1)}
        </span>
        <span 
          className="text-xs font-black uppercase px-2 py-0.5 rounded-full mt-0.5 tracking-wider"
          style={{ backgroundColor: `${color}22`, color }}
        >
          Grade {grade}
        </span>
      </div>
    </div>
  );
};
