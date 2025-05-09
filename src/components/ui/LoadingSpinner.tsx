import { useState, useEffect } from 'react';
import RetroTVLoader from './RetroTVLoader';
import { Loader2Icon } from './icons';

interface LoadingSpinnerProps {
  size?: number;
  className?: string;
  text?: string;
  useRetroTV?: boolean;
  tvSize?: 'sm' | 'md' | 'lg';
}

const LoadingSpinner = ({
  size = 24,
  className = '',
  text = 'Loading...',
  useRetroTV = true,
  tvSize = 'md'
}: LoadingSpinnerProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className={`flex min-h-[100px] w-full items-center justify-center ${className}`}>
        <Loader2Icon className="animate-spin text-primary" size={size} />
      </div>
    );
  }

  return (
    <div className={`flex min-h-[200px] w-full items-center justify-center ${className}`}>
      {useRetroTV ? (
        <RetroTVLoader text={text} size={tvSize} />
      ) : (
        <Loader2Icon className="animate-spin text-primary" size={size} />
      )}
    </div>
  );
};

export default LoadingSpinner;
