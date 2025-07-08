import * as React from 'react';
import { useState, useEffect, useRef } from 'react';

declare const process: {
  env: {
    NODE_ENV: 'development' | 'production' | 'test';
  };
};
import type { VideoItem } from '../data/videos';

interface VideoThumbnailProps {
  video: VideoItem;
  isActive: boolean;
  onMouseEnter: (index?: number) => void;
  onMouseLeave: (index?: number) => void;
  onClick?: () => void;
  className?: string;
  index?: number;
}

const VideoThumbnail: React.FC<VideoThumbnailProps> = ({
  video,
  isActive,
  onMouseEnter = (): void => {},
  onMouseLeave = (): void => {},
  onClick,
  className = '',
  index
}) => {
  console.log('Rendering VideoThumbnail with video:', video.id, 'active:', isActive, 'thumbnail:', video.thumbnail);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const retryCount = useRef(0);

  // Set up intersection observer for lazy loading
  useEffect(() => {
    console.log(`Setting up intersection observer for video: ${video.id}`);
    console.log('Thumbnail path:', video.thumbnail);
    
    const img = imgRef.current;
    if (!img) {
      console.log('No image element found');
      return () => {}; // Return empty cleanup function
    }

    // Check if the image has already been loaded
    if (img.complete) {
      console.log('Image already loaded');
      console.log('Current image source:', img.currentSrc || img.src);
      setIsLoading(false);
      return () => {}; // Return empty cleanup function
    }

    const handleLoad = (e: Event) => {
      const target = e.target as HTMLImageElement;
      console.log('Image loaded successfully:', {
        thumbnail: video.thumbnail,
        currentSrc: target.currentSrc,
        src: target.src,
        complete: target.complete,
        naturalWidth: target.naturalWidth,
        naturalHeight: target.naturalHeight
      });
      setIsLoading(false);
      setHasError(false);
    };

    const handleError = (error: any) => {
      console.error('Error loading image:', {
        thumbnail: video.thumbnail,
        error: error.message || 'Unknown error',
        retryCount: retryCount.current,
        imgSrc: img.getAttribute('src'),
        imgDataSrc: img.getAttribute('data-src')
      });
      
      // Try with a fallback image if the specified one fails
      const fallbackThumbnail = `/loading${(parseInt(video.id) % 6) + 2}.jpg`;
      console.log(`Trying fallback thumbnail: ${fallbackThumbnail}`);
      
      if (retryCount.current === 0) {
        // First try with the fallback thumbnail
        img.src = fallbackThumbnail;
        retryCount.current += 1;
        return;
      }
      
      setHasError(true);
      setIsLoading(false);
      
      console.error('All thumbnail loading attempts failed');
    };

    // Set up event listeners
    img.addEventListener('load', handleLoad);
    img.addEventListener('error', handleError);

    if ('IntersectionObserver' in window) {
      const handleIntersect: IntersectionObserverCallback = (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && imgRef.current) {
            const currentImg = imgRef.current;
            const src = currentImg.getAttribute('data-src');
            if (src) {
              currentImg.src = src;
              currentImg.removeAttribute('data-src');
            }
            observer.unobserve(currentImg);
          }
        });
      };

      const observer = new IntersectionObserver(handleIntersect, {
        rootMargin: '200px',
        threshold: 0.01
      });

      observer.observe(img);
      observerRef.current = observer;

      return () => {
        img.removeEventListener('load', handleLoad);
        img.removeEventListener('error', handleError);
        
        if (observerRef.current) {
          observerRef.current.disconnect();
        }
      };
    } else {
      // Fallback for browsers that don't support IntersectionObserver
      const src = img.getAttribute('data-src');
      if (src) {
        img.src = src;
        img.removeAttribute('data-src');
      }
      
      return () => {
        img.removeEventListener('load', handleLoad);
        img.removeEventListener('error', handleError);
      };
    }
  }, [video.thumbnail]); // Add video.thumbnail to dependency array to handle thumbnail changes

  const handleImageLoad = () => {
    console.log(`Image loaded: ${video.thumbnail}`);
    setIsLoading(false);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error(`Error loading image: ${video.thumbnail}`, e);
    setHasError(true);
    setIsLoading(false);
  };

  // Use a placeholder if the image fails to load
  if (hasError) {
    return (
      <div 
        className={`relative w-full aspect-video bg-gray-800 flex items-center justify-center ${className}`}
        onMouseEnter={() => onMouseEnter(index)}
        onMouseLeave={() => onMouseLeave(index)}
        onClick={onClick}
        role="img"
        aria-label={`${video.title} thumbnail not available`}
      >
        <div className="text-gray-500 text-sm">Thumbnail not available</div>
      </div>
    );
  }

  return (
    <div 
      className={`relative w-full aspect-video overflow-hidden ${className}`}
      onMouseEnter={() => onMouseEnter(index)}
      onMouseLeave={() => onMouseLeave(index)}
      onClick={onClick}
      role="article"
      aria-label={`Video: ${video.title}`}
    >
      {/* Lazy loaded thumbnail image */}
      <div className="absolute inset-0 bg-gray-900">
        <img
          ref={imgRef}
          data-src={video.thumbnail}
          src="" // Start with empty src for lazy loading
          alt="" // Empty alt as we have a visible play button and title
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          }`}
          loading="lazy"
          width={video.width}
          height={video.height}
          onLoad={handleImageLoad}
          onError={handleImageError}
          aria-hidden="true"
          style={{
            border: '2px solid red', // Temporary for debugging
            boxSizing: 'border-box'
          }}
        />
        {process.env.NODE_ENV === 'development' && (
          <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-1 text-center">
            {video.thumbnail}
          </div>
        )}
      </div>
      
      {/* Loading skeleton */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-800 animate-pulse"></div>
      )}
      
      {/* Video duration */}
      <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
        {video.duration}
      </div>
      
      {/* Play button overlay */}
      {!isActive && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity duration-200">
          <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
            <svg className="w-6 h-6 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(VideoThumbnail);
