import React, { useState, useEffect, useRef } from 'react';

interface PlaceholderImageProps {
  src: string | undefined;
  alt: string;
  width?: string;
  height?: string;
  className?: string;
  fallbackWidth?: number;
  fallbackHeight?: number;
  fallbackSrc?: string;
}

const PlaceholderImage: React.FC<PlaceholderImageProps> = ({
  src,
  alt,
  width = '100%',
  height = '100%',
  className = '',
  fallbackWidth = 400,
  fallbackHeight = 300,
  fallbackSrc,
}) => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [imageSrc, setImageSrc] = useState(src || '');
  const imgRef = useRef<HTMLImageElement>(null);
  const attemptedSrcs = useRef<Set<string>>(new Set());
  const attemptCount = useRef<number>(0);
  const maxAttempts = 3;
  const initialLoadComplete = useRef<boolean>(false);

  // Reset states when src changes or component mounts
  useEffect(() => {
    // Clear attempted sources when component mounts or remounts
    if (!initialLoadComplete.current) {
      attemptedSrcs.current.clear();
      initialLoadComplete.current = true;
    }

    // If src is undefined or empty, use fallback immediately
    if (!src) {
      if (fallbackSrc) {
        setImageSrc(fallbackSrc);
        attemptedSrcs.current.add(fallbackSrc);
      } else {
        setError(true);
        setLoading(false);
      }
      return;
    }

    // Always try to load the image when the component mounts or src changes
    // Don't skip even if we've tried this source before
    setError(false);
    setLoading(true);
    setImageSrc(src);
    attemptCount.current = 0;

    // Preload the image
    const img = new Image();
    img.src = src;
    img.onload = () => {
      setLoading(false);
    };
    img.onerror = () => {
      handleImageError();
    };

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src, fallbackSrc]);

  // Generate a placeholder with the alt text
  const generatePlaceholder = () => {
    // Create a placeholder URL with the alt text
    return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${fallbackWidth}' height='${fallbackHeight}' viewBox='0 0 ${fallbackWidth} ${fallbackHeight}'%3E%3Crect width='100%25' height='100%25' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial, sans-serif' font-size='24' text-anchor='middle' dominant-baseline='middle' fill='%23888888'%3E${alt.replace(/ /g, '%20')}%3C/text%3E%3C/svg%3E`;
  };

  const handleImageLoad = () => {
    setLoading(false);
  };

  const handleImageError = () => {
    console.error(`Failed to load image: ${imageSrc}`);
    if (fallbackSrc) {
      setImageSrc(fallbackSrc);
    } else {
      setError(true);
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full h-full">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      )}
      <img
        ref={imgRef}
        src={error ? generatePlaceholder() : imageSrc}
        alt={alt}
        width={width}
        height={height}
        className={`${className} ${loading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onLoad={handleImageLoad}
        onError={() => handleImageError()}
      />
    </div>
  );
};

export default PlaceholderImage;
