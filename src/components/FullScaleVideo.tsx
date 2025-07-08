import React, { useEffect, useRef, useState } from 'react';

const FullScaleVideo: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        root: null,
        rootMargin: '200px',
        threshold: 0.1
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Set initial loading state
  useEffect(() => {
    setIsLoading(true);
  }, []);

  // Handle video loading and playback
  useEffect(() => {
    if (!isInView || !videoRef.current) return;

    const video = videoRef.current;
    let timeoutId: ReturnType<typeof setTimeout>;
    
    const handleCanPlay = () => {
      // Small delay for smoother transition
      timeoutId = setTimeout(() => {
        setIsLoading(false);
        video.play().catch(error => {
          console.warn('Video autoplay failed:', error);
          setIsLoading(false); // Still show video even if autoplay fails
        });
      }, 500);
    };

    const handleError = () => {
      console.error('Video loading error');
      setIsLoading(false);
    };

    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);
    video.load(); // Start loading the video

    // Cleanup
    return () => {
      clearTimeout(timeoutId);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
      video.pause();
      video.removeAttribute('src');
      video.load();
    };
  }, [isInView]);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-screen bg-black overflow-hidden"
    >
      {/* Always show loading state until video is ready */}
      <div className={`absolute inset-0 z-10 transition-opacity duration-500 ${isLoading ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-black">
          <img 
            src="/LoadingImg" 
            alt="Loading video..." 
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback to default loading if image fails to load
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = '';
            }}
          />
        </div>
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>

      {/* Video element */}
      {isInView && (
        <>
          <video
            ref={videoRef}
            className={`w-full h-full object-cover transition-opacity duration-1000 ${
              isLoading ? 'opacity-0' : 'opacity-100'
            }`}
            playsInline
            loop
            muted={isMuted}
            preload="auto"
            poster="/LoadingImg.jpg" // Add a poster frame for better loading
          >
            <source src="/veo1.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Controls overlay */}
          <div className="absolute bottom-4 right-4 z-20 flex items-center space-x-3">
            <button
              onClick={toggleMute}
              className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
              aria-label={isMuted ? 'Unmute video' : 'Mute video'}
            >
              {isMuted ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default FullScaleVideo;