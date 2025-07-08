import React, { forwardRef, useEffect, useRef } from 'react';

interface LazyVideoPlayerProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  src: string;
  webmSrc?: string;
  isActive: boolean;
  title: string;
  className?: string;
  onFirstPlay?: () => void;
}

const LazyVideoPlayer = forwardRef<HTMLVideoElement, LazyVideoPlayerProps>(({ 
  src, 
  webmSrc, 
  isActive, 
  title, 
  className = '',
  onFirstPlay,
  ...props 
}, ref) => {
  const hasPlayedRef = useRef(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Combine forwarded ref with local ref
  const setRefs = (element: HTMLVideoElement | null) => {
    // Update the forwarded ref
    if (typeof ref === 'function') {
      ref(element);
    } else if (ref) {
      ref.current = element;
    }
    
    // Update local ref
    videoRef.current = element;
  };

  // Handle video error
  const handleError = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    console.error('Error loading video:', e);
    const target = e.target as HTMLVideoElement;
    target.style.display = 'none';
  };
  
  // Handle first play
  const handlePlay = () => {
    if (!hasPlayedRef.current) {
      hasPlayedRef.current = true;
      onFirstPlay?.();
    }
  };
  
  // Handle active state changes
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    if (isActive) {
      // Only play if not already playing
      if (video.paused) {
        video.play().catch(error => {
          console.debug('Autoplay prevented:', error);
        });
      }
    } else {
      // Only pause if not already paused
      if (!video.paused) {
        video.pause();
        video.currentTime = 0;
      }
    }
  }, [isActive]);

  return (
    <video
      ref={setRefs}
      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
        isActive ? 'opacity-100' : 'opacity-0'
      } ${className}`}
      preload="metadata"
      muted
      loop
      playsInline
      title={title}
      onError={handleError}
      onPlay={handlePlay}
      {...props}
    >
      {webmSrc && <source src={webmSrc} type="video/webm" />}
      <source src={src} type={src.endsWith('.webm') ? 'video/webm' : 'video/mp4'} />
      Your browser does not support the video tag.
    </video>
  );
});

LazyVideoPlayer.displayName = 'LazyVideoPlayer';

export default LazyVideoPlayer;
