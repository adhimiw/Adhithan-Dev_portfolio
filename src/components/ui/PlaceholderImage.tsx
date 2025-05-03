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
      handleImageError(src);
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

  const handleImageError = (originalSrc: string) => {
    console.error(`Failed to load image: ${imageSrc}`);

    // Increment attempt count
    attemptCount.current += 1;

    // Check if it's a placeholder.com URL and immediately use fallback
    if (imageSrc.includes('placeholder.com') || imageSrc.includes('via.placeholder.com')) {
      if (fallbackSrc) {
        // Use the explicit fallback immediately
        setImageSrc(fallbackSrc);
        return;
      } else {
        // Show placeholder SVG
        setError(true);
        setLoading(false);
        return;
      }
    }

    // If we've tried too many times, show placeholder
    if (attemptCount.current >= maxAttempts) {
      if (fallbackSrc) {
        // Try the explicit fallback if provided
        setImageSrc(fallbackSrc);
      } else {
        // Show placeholder
        setError(true);
        setLoading(false);
      }
      return;
    }

    // Try different URL formats
    const alternativePaths = [];

    // If the image is from the API and failed, try to load from public folder
    if (imageSrc.startsWith('/api/')) {
      alternativePaths.push(imageSrc.replace('/api/', '/'));
    }

    // If it's a relative URL without a leading slash, try with a leading slash
    if (!imageSrc.startsWith('/') && !imageSrc.startsWith('http')) {
      alternativePaths.push(`/${imageSrc}`);
    }

    // If it has a leading slash but not /api/, try with /api/
    if (imageSrc.startsWith('/') && !imageSrc.startsWith('/api/')) {
      alternativePaths.push(`/api${imageSrc}`);
    }

    // Try removing /about from path if it exists
    if (imageSrc.includes('/about/')) {
      alternativePaths.push(imageSrc.replace('/about/', '/'));
    }

    // For avatar specifically, try the direct avatar endpoint
    if (imageSrc.includes('avatar') || originalSrc.includes('avatar')) {
      alternativePaths.push('/api/about/avatar');
    }

    // Try the fallback as a last resort
    if (fallbackSrc) {
      alternativePaths.push(fallbackSrc);
    }

    // Try each alternative path
    for (const path of alternativePaths) {
      // Don't check if we've already tried this path - always try alternatives
      // when navigating back to the page
      setImageSrc(path);
      return;
    }

    // If all attempts fail, show placeholder
    setError(true);
    setLoading(false);
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
        onError={() => handleImageError(imageSrc)}
      />
    </div>
  );
};

export default PlaceholderImage;
