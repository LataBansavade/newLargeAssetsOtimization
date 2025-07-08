import React, { useState, useRef, useEffect, useCallback } from 'react';

interface VideoItem {
  id: number;
  src: string;
  poster: string;
}

const videoItems: VideoItem[] = [
  {
    id: 1,
    src: '/V1.mp4',
    poster: '/V1.jpg'
  },
  {
    id: 2,
    src: '/V2.mp4',
    poster: '/V2.jpg'
  },
  {
    id: 3,
    src: '/V3.mp4',
    poster: '/V3.jpg'
  },
  {
    id: 4,
    src: '/wildLife.mp4',
    poster: '/wildLife.jpg'
  },
];

const VideoSlider: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Handle video play/pause
  const togglePlayPause = useCallback(() => {
    const video = videoRefs.current[currentIndex];
    if (video) {
      if (video.paused) {
        video.play();
        setIsPlaying(true);
      } else {
        video.pause();
        setIsPlaying(false);
      }
    }
  }, [currentIndex]);

  // Go to next video
  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => 
      prevIndex === videoItems.length - 1 ? 0 : prevIndex + 1
    );
    setIsPlaying(true);
  }, []);

  // Go to previous video
  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? videoItems.length - 1 : prevIndex - 1
    );
    setIsPlaying(true);
  }, []);

  // Go to specific slide
  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsPlaying(true);
  };

  // Auto play functionality
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      nextSlide();
    }, 5000); // Change slide every 5 seconds

    return () => {
      clearInterval(timer);
    };
  }, [isPlaying, nextSlide]);

  // Play the current video when index changes
  useEffect(() => {
    const currentVideo = videoRefs.current[currentIndex];
    if (currentVideo) {
      videoRefs.current.forEach((video, index) => {
        if (video && index !== currentIndex) {
          video.pause();
          video.currentTime = 0;
        }
      });
      
      currentVideo.play().catch(error => {
        console.error('Error playing video:', error);
      });
    }
  }, [currentIndex]);

  // Pause video when component unmounts
  useEffect(() => {
    return () => {
      videoRefs.current.forEach(video => {
        if (video) {
          video.pause();
          video.currentTime = 0;
        }
      });
    };
  }, []);

  return (
    <div className="relative w-[80%] sm:w-[40%] mx-auto overflow-hidden bg-black">
      {/* Video Slider */}
      <div 
        className="relative h-[70vh] w-full transition-transform duration-500 ease-in-out"
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
        }}
      >
        {videoItems.map((item, index) => (
          <div 
            key={item.id}
            className="absolute top-0 left-0 w-full h-full transition-opacity duration-500"
            style={{
              transform: `translateX(${index * 100}%)`,
              opacity: currentIndex === index ? 1 : 0,
              zIndex: currentIndex === index ? 10 : 1,
            }}
          >
            <video
              ref={el => { if (el) videoRefs.current[index] = el; }}
              src={item.src}
              poster={item.poster}
              className="w-full h-full object-cover"
              loop
              muted
              playsInline
              onClick={togglePlayPause}
            />
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent">
                
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-colors"
        aria-label="Previous video"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-colors"
        aria-label="Next video"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Play/Pause Button */}
      <button
        onClick={togglePlayPause}
        className="absolute top-4 right-4 z-20 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-colors"
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )}
      </button>

      {/* Dots Navigation */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-20">
        {videoItems.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              currentIndex === index ? 'bg-white w-8' : 'bg-white/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default VideoSlider;