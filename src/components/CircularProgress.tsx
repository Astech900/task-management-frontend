import React from 'react';

interface CircularProgressProps {
  percentage: number;
  color?: string;
}

const CircularProgress: React.FC<CircularProgressProps> = ({ percentage, color = '#2B66FF' }) => {
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg className="transform -rotate-90 w-12 h-12">
        <circle 
          cx="24" 
          cy="24" 
          r={radius} 
          stroke="currentColor" 
          strokeWidth="3" 
          fill="transparent" 
          className="text-gray-100" 
        />
        <circle
          cx="24"
          cy="24"
          r={radius}
          stroke={color}
          strokeWidth="3"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000 ease-out"
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute text-[10px] font-bold" style={{ color }}>{percentage}%</span>
    </div>
  );
};

export default CircularProgress;
