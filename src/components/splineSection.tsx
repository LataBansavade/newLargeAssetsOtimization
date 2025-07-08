import { lazy, Suspense, useEffect, useRef, useState } from 'react';

// Lazy load the Spline component
const Spline = lazy(() => import('@splinetool/react-spline'));

// Loading skeleton
const SplineLoader = () => (
  <div className="w-full h-[600px] bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl flex items-center justify-center">
    <div className="animate-pulse flex flex-col items-center">
      <div className="h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-gray-400">Loading 3D Experience...</p>
    </div>
  </div>
);

// Error boundary
const SplineError = () => (
  <div className="w-full h-[600px] bg-gradient-to-br from-red-900/30 to-gray-900 rounded-2xl flex items-center justify-center">
    <div className="text-center p-6">
      <div className="text-red-400 text-4xl mb-4">⚠️</div>
      <h3 className="text-xl font-medium text-white mb-2">3D Content Failed to Load</h3>
      <p className="text-gray-400 max-w-md">
        We couldn't load the 3D experience. Please check your internet connection or try again later.
      </p>
    </div>
  </div>
);

const SplineSection = () => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
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

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    console.error('Failed to load Spline scene');
    setHasError(true);
    setIsLoading(false);
  };

  // Handle window resize for better performance
  useEffect(() => {
    const handleResize = () => {
      // Add any resize handling if needed
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (hasError) {
    return <SplineError />;
  }

  return (
    <section 
      ref={sectionRef}
      className="relative py-16 px-4 w-full overflow-hidden"
      style={{ perspective: '1000px' }}
    >
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
          3D Experience
        </h2>
        
        <div className="relative w-full h-[600px] rounded-2xl overflow-hidden">
          {isLoading && <SplineLoader />}
          
          <Suspense fallback={<SplineLoader />}>
            {isInView && (
              <Spline
                scene="https://prod.spline.design/VKw01DgzF5Jqm2LM/scene.splinecode"
                onLoad={handleLoad}
                onError={handleError}
                className={`w-full h-full transition-opacity duration-500 ${
                  isLoading ? 'opacity-0' : 'opacity-100'
                }`}
              />
            )}
          </Suspense>

          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-black/20" />
        </div>
      </div>
    </section>
  );
};

export default SplineSection;