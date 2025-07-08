import { useEffect, useRef, useState, useCallback } from 'react';

interface VideoItem {
  id: string;
  src: string;
  thumbnail: string;
  title: string;
}

const VideoGallery = () => {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});
  const observerRef = useRef<IntersectionObserver | null>(null);
  
  const setVideoRef = useCallback((id: string) => (el: HTMLVideoElement | null) => {
    videoRefs.current[id] = el;
  }, []);

  // List of video files in your public folder
  const videoFiles = [
    { id: '1', src: 'https://res.cloudinary.com/dmom1krba/video/upload/v1751994884/winter_emwzsh.mp4', thumbnail: '/loading2.jpg', title: 'Mountain View' },
    { id: '2', src: 'https://res.cloudinary.com/dmom1krba/video/upload/v1751994884/winter_emwzsh.mp4', thumbnail: '/loading3.jpg', title: 'Ocean Waves' },
    { id: '3', src: 'https://res.cloudinary.com/dmom1krba/video/upload/v1751994882/sea_j3x2gx.mp4', thumbnail: '/loading4.jpg', title: 'City Life' },
    { id: '4', src: 'https://res.cloudinary.com/dmom1krba/video/upload/v1751994836/V3_fwma4c.mp4', thumbnail: '/loading5.jpg', title: 'Wildlife' },
    { id: '5', src: 'https://res.cloudinary.com/dmom1krba/video/upload/v1751994834/veo2_pquvmy.mp4', thumbnail: '/loading6.jpg', title: 'Winter Wonderland' },
    { id: '6', src: 'https://res.cloudinary.com/dmom1krba/video/upload/v1751994856/space_couple_ikj5tv.mp4', thumbnail: '/loading3.jpg', title: 'Space Exploration' },
  ];

  // Set up intersection observer for viewport detection
  useEffect(() => {
    setVideos(videoFiles);
    
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.8 // 50% of the video must be visible
    };

    const handleIntersect: IntersectionObserverCallback = (entries) => {
      entries.forEach(entry => {
        const videoId = (entry.target as HTMLElement).getAttribute('data-video-id');
        if (!videoId) return;
        
        if (entry.isIntersecting) {
          // Play video when 50% visible
          const video = videoRefs.current[videoId];
          if (video) {
            video.play().catch(error => {
              console.error('Error playing video:', error);
            });
          }
        } else {
          // Pause video when not visible
          const video = videoRefs.current[videoId];
          if (video) {
            video.pause();
            video.currentTime = 0; // Reset to beginning
          }
        }
      });
    };

    observerRef.current = new IntersectionObserver(handleIntersect, options);

    // Cleanup
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // Set up intersection observer for each video element
  const setupVideoObserver = useCallback((element: HTMLElement | null, videoId: string) => {
    if (!element || !observerRef.current) return;
    
    // Add data attribute to identify the video
    element.setAttribute('data-video-id', videoId);
    
    // Observe the element
    observerRef.current.observe(element);
    
    // Cleanup function
    return () => {
      if (observerRef.current) {
        observerRef.current.unobserve(element);
      }
    };
  }, []);

  return (
    <div className="container mx-auto px-40 py-8">
      <h2 className="text-3xl font-bold text-white mb-8">Video Gallery</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <div 
            key={video.id} 
            className="relative group bg-gray-900 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all"
          >
            <div 
              ref={(el) => setupVideoObserver(el, video.id)}
              className="w-full h-full"
            >
              <video
                ref={setVideoRef(video.id)}
                className="w-full h-48 md:h-56 lg:h-64 object-cover"
                loop
                muted
                playsInline
                preload="metadata"
                poster={video.thumbnail}
              >
                <source src={video.src} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
            
            
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoGallery;
