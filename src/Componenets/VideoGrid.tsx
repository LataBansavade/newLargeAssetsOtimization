import { useEffect, useState, useRef } from 'react';

interface VideoItem {
  id: number;
  title: string;
  videoSrc: string;
  duration: string;
}

const VideoGrid = () => {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [activeVideo, setActiveVideo] = useState<number | null>(null);
  
  // Initialize refs array
  useEffect(() => {
    videoRefs.current = videos.map((_, i) => videoRefs.current[i] || null);
  }, [videos]);

  useEffect(() => {
    // Simple video data with direct paths
    const videoData: VideoItem[] = [
      {
        id: 1,
        title: 'Moving Car',
        videoSrc: '/winter.mp4',
        duration: '0:15'
      },
      {
        id: 2,
        title: 'Earth from Space',
        videoSrc: '/earth.mp4',
        duration: '0:22'
      },
      {
        id: 3,
        title: 'Moving Car',
        videoSrc: '/veo2.mp4',
        duration: '0:18'
      },
      {
        id: 4,
        title: 'Space Couple',
        videoSrc: '/space couple.mp4',
        duration: '0:27'
      },
      {
        id: 5,
        title: 'Zebra',
        videoSrc: '/zebra.mp4',
        duration: '0:27'
      },
      {
        id: 6,
        title: 'Snow',
        videoSrc: '/snow.mp4',
        duration: '0:27'
      }
    ];

    // Preload videos
    const preloadVideos = async () => {
      const videoPromises = videoData.map((video) => {
        return new Promise((resolve) => {
          const videoEl = document.createElement('video');
          videoEl.src = video.videoSrc;
          videoEl.preload = 'auto';
          videoEl.onloadeddata = () => resolve(true);
          videoEl.onerror = () => resolve(true); // Resolve even if there's an error
        });
      });

      await Promise.all(videoPromises);
      setVideos(videoData);
      setIsLoading(false);
    };

    preloadVideos();
  }, []);

  const loadingVideos = [
    { id: 1, title: 'Moving Car', videoSrc: '/loading2.jpg', duration: '0:15' },
    { id: 2, title: 'Earth from Space', videoSrc: '/loading3.jpg', duration: '0:22' },
    { id: 3, title: 'Moving Car', videoSrc: '/loading4.jpg', duration: '0:18' },
    { id: 4, title: 'Space Couple', videoSrc: '/loading5.jpg', duration: '0:27' },
    { id: 5, title: 'Zebra', videoSrc: '/loading6.jpg', duration: '0:27' },
    { id: 6, title: 'Snow', videoSrc: '/loading7.jpg', duration: '0:27' }
  ];

  if (isLoading) {
    return (
      <div className="container mx-auto px-40 py-12">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">Video Gallery</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {loadingVideos.map((video) => (
            <div key={video.id} className="bg-gray-800 rounded-xl overflow-hidden">
              <div className="relative aspect-video bg-gray-800">
                <img 
                  src={video.videoSrc.replace('.mp4', '.jpg')}
                  alt={`Loading ${video.title}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <div className="animate-pulse flex space-x-2">
                    <div className="w-3 h-3 bg-white/70 rounded-full"></div>
                    <div className="w-3 h-3 bg-white/70 rounded-full"></div>
                    <div className="w-3 h-3 bg-white/70 rounded-full"></div>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-white font-medium truncate">{video.title}</h3>
                <p className="text-gray-400 text-sm">{video.duration}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Handle video hover
  const handleMouseEnter = (index: number) => {
    setActiveVideo(index);
    const video = videoRefs.current[index];
    if (video) {
      video.play().catch(e => console.log('Autoplay prevented:', e));
    }
  };

  const handleMouseLeave = (index: number) => {
    setActiveVideo(null);
    const video = videoRefs.current[index];
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
  };

  return (
    <div className="container mx-auto px-40 py-12">
      <h2 className="text-3xl font-bold text-white mb-8 text-center">Video Gallery</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
        {videos.map((video, index) => (
          <div 
            key={video.id} 
            className="group bg-gray-800 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20 hover:-translate-y-1"
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={() => handleMouseLeave(index)}
          >
            <div className="relative overflow-hidden">
              <div className="relative w-full aspect-video bg-gray-900">
                <div className="absolute inset-0 flex items-center justify-center">
                  <img 
                    src={index === videos.length - 1 ? '/loading7.jpg' : `/loading${(index % 6) + 2}.jpg`} 
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <video
                  ref={el => {
                    if (el) {
                      videoRefs.current[index] = el;
                    }
                  }}
                  className={`absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${activeVideo === index ? 'opacity-100' : 'opacity-0'}`}
                  preload="none"
                  muted
                  loop
                  playsInline
                  title=""
                  onError={(e) => {
                    console.error('Video error:', e);
                    const target = e.target as HTMLVideoElement;
                    target.outerHTML = `
                      <div class="aspect-video bg-gray-900 flex items-center justify-center text-red-400 p-4">
                        <div class="text-center">
                          <svg class="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                          </svg>
                          <p class="text-sm">Error loading video</p>
                          <p class="text-xs opacity-70 mt-1">${video.videoSrc}</p>
                        </div>
                        <svg class="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                        </svg>
                        <p class="text-sm">Error loading video</p>
                        <p class="text-xs opacity-70 mt-1">${video.videoSrc}</p>
                      </div>
                    </div>
                  `;
                }}
                >
                  <source src={video.videoSrc} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>

              <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                {video.duration}
              </div>
            </div>
           
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoGrid;