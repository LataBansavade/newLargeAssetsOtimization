import { useRef, useState, useEffect } from 'react';

interface VideoSource {
  src: string;
  title: string;
}

interface VideoPlayerProps {
  sources: VideoSource[];
}

const VideoPlayer = ({ sources }: VideoPlayerProps) => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const currentSource = sources[currentVideoIndex];

  // Handle video play when source changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(error => {
        console.log('Auto-play was prevented:', error);
      });
    }
  }, [currentVideoIndex]);

  const goToNext = () => {
    setCurrentVideoIndex(prev => (prev + 1) % sources.length);
  };

  const goToPrevious = () => {
    setCurrentVideoIndex(prev => (prev - 1 + sources.length) % sources.length);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Video Container */}
      <div className="relative group overflow-hidden rounded-xl aspect-video bg-black">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          loop
          muted
          playsInline
          preload="auto"
          key={currentSource.src}
        >
          <source src={currentSource.src} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Video Title Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
          <span className="text-white font-medium text-lg">{currentSource.title}</span>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="mt-6 flex flex-col items-center">
        <div className="flex items-center gap-8">
          <button 
            onClick={goToPrevious}
            className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            aria-label="Previous video"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <div className="text-white font-medium text-center">
            <div className="text-2xl">{currentVideoIndex + 1}</div>
            <div className="text-sm text-gray-400">of {sources.length}</div>
          </div>
          
          <button 
            onClick={goToNext}
            className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            aria-label="Next video"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        
        {/* Progress Dots */}
        <div className="mt-6 flex gap-2">
          {sources.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentVideoIndex(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentVideoIndex 
                  ? 'w-8 bg-white' 
                  : 'w-2 bg-white/30 hover:bg-white/50'
              }`}
              aria-label={`Go to video ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
