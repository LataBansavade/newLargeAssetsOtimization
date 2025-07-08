import React, { lazy, Suspense, useMemo, useRef, useState, useEffect } from 'react';

// Lazy load the VideoPlayer component
const VideoPlayer = lazy(() => import('./VideoPlayer'));

// Memoize video sources to prevent re-renders
interface VideoSource {
  src: string;
  title: string;
  poster: string;
}

const VIDEO_SOURCES: VideoSource[] = [
    { 
        src: '/snow.mp4', 
        title: 'Snow',
        poster: '/snow-poster.jpg'
      },
  { 
    src: '/crowd.mp4', 
    title: 'Crowd',
    poster: '/crowd-poster.jpg' 
  },
  { 
    src: '/sea.mp4', 
    title: 'Sea',
    poster: '/sea-poster.jpg'
  },
 
];

// Loading placeholder component with custom loading image
const LoadingPlaceholder = () => (
  <div className="w-full aspect-video bg-gray-800 rounded-xl flex items-center justify-center overflow-hidden">
    <img 
      src="/loadingImg" 
      alt="Loading video..." 
      className="w-full h-full object-cover"
      onError={(e) => {
        // Fallback to default loading if image fails to load
        const target = e.target as HTMLImageElement;
        target.onerror = null;
        target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJWNk0xMiAxOFYyMk0yMSAxMkgxN00zIDEySDEyTTE5LjA3IDQuOTNMNi4xNCAxNy44Nk0xNy44NiA2LjE0TDAuOTkgMTkuMDEiIHN0cm9rZT0iI0ZGRiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+Cg==';
      }}
    />
  </div>
);

// Error boundary component
class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('VideoPlayer Error:', error, errorInfo);
  }

  override render() {
    if (this.state.hasError) {
      return (
        <div className="w-full aspect-video bg-gray-800 rounded-xl flex items-center justify-center">
          <p className="text-gray-400">Failed to load video player.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

const FeaturedVideos = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Memoize the video sources
  const videoSources = useMemo(() => VIDEO_SOURCES, []);

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true);
          // Disconnect after first intersection
          if (sectionRef.current) {
            observer.unobserve(sectionRef.current);
          }
        }
      },
      {
        root: null,
        rootMargin: '200px',
        threshold: 0.1
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
      observer.disconnect();
    };
  }, []);

  // Preload the first video
  useEffect(() => {
    if (isVisible && videoSources[0]?.src) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'video';
      link.href = videoSources[0].src;
      document.head.appendChild(link);
      
    
    }
  }, [isVisible, videoSources]);

  return (
    <section 
      ref={sectionRef}
      className="py-16 px-4 will-change-transform"
      style={{ contentVisibility: 'auto' }}
    >
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
          Featured Videos
        </h2>
        
        <ErrorBoundary>
          <Suspense fallback={<LoadingPlaceholder />}>
            {isVisible ? (
              <div className="will-change-contents">
                <VideoPlayer sources={videoSources} />
              </div>
            ) : (
              <LoadingPlaceholder />
            )}
          </Suspense>
        </ErrorBoundary>
      </div>
    </section>
  );
};

export default React.memo(FeaturedVideos);