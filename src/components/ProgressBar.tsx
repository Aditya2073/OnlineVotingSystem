
import React from 'react';

interface ProgressBarProps {
  value: number;
  max: number;
  label?: string;
  color?: 'blue' | 'green' | 'orange' | 'red';
  size?: 'sm' | 'md' | 'lg';
  showPercentage?: boolean;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max,
  label,
  color = 'blue',
  size = 'md',
  showPercentage = false,
  className = ''
}) => {
  const percentage = Math.min(Math.round((value / max) * 100), 100);

  const getColorClass = () => {
    switch (color) {
      case 'green':
        return 'bg-indian-green';
      case 'orange':
        return 'bg-indian-orange';
      case 'red':
        return 'bg-red-500';
      default:
        return 'bg-indian-blue';
    }
  };

  const getHeightClass = () => {
    switch (size) {
      case 'sm':
        return 'h-1';
      case 'lg':
        return 'h-4';
      default:
        return 'h-2';
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <div className="flex justify-between mb-1 text-sm">
          <span className="text-gray-700">{label}</span>
          {showPercentage && <span className="text-gray-500">{percentage}%</span>}
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full ${getHeightClass()}`}>
        <div
          className={`${getColorClass()} ${getHeightClass()} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
