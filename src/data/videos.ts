export interface VideoItem {
  id: string;
  title: string;
  videoSrc: string;
  webmSrc?: string; // Optional WebM version for better compression
  thumbnail: string;
  duration: string;
  views: string;
  timestamp: string;
  size?: number; // In KB
  width: number;
  height: number;
  aspectRatio: string; // e.g. '16/9'
  optimized: boolean;
}

// Sample video data with WebM alternatives
export const videos: VideoItem[] = [
  {
    id: '1',
    title: 'Mountain Landscape',
    videoSrc: '/V1.mp4',
    thumbnail: '/loading2.jpg',
    duration: '0:15',
    views: '2.4M',
    timestamp: '3 days ago',
    width: 1280,
    height: 720,
    aspectRatio: '16/9',
    optimized: true
  },
  {
    id: '2',
    title: 'Ocean Waves',
    videoSrc: '/V2.mp4',
    thumbnail: '/loading3.jpg',
    duration: '0:15',
    views: '1.8M',
    timestamp: '1 week ago',
    width: 1280,
    height: 720,
    aspectRatio: '16/9',
    optimized: true
  },
  {
    id: '3',
    title: 'City Time Lapse',
    videoSrc: '/V3.mp4',
    thumbnail: '/loading4.jpg',
    duration: '0:30',
    views: '3.1M',
    timestamp: '2 weeks ago',
    width: 1920,
    height: 1080,
    aspectRatio: '16/9',
    optimized: true
  },
  {
    id: '4',
    title: 'Nature Documentary',
    videoSrc: '/wildLife.mp4',
    thumbnail: '/loading5.jpg',
    duration: '1:45',
    views: '5.7M',
    timestamp: '1 month ago',
    width: 1920,
    height: 1080,
    aspectRatio: '16/9',
    optimized: true
  },
  {
    id: '5',
    title: 'Space Exploration',
    videoSrc: '/space couple.mp4',
    thumbnail: '/loading6.jpg',
    duration: '2:30',
    views: '1.2M',
    timestamp: '5 days ago',
    width: 1280,
    height: 720,
    aspectRatio: '16/9',
    optimized: true
  },
  {
    id: '6',
    title: 'Winter Wonderland',
    videoSrc: '/winter.mp4',
    thumbnail: '/loading7.jpg',
    duration: '5:15',
    views: '890K',
    timestamp: '2 days ago',
    width: 1280,
    height: 720,
    aspectRatio: '16/9',
    optimized: true
  }
];

// Helper function to get paginated videos
// Cache for pagination results
const paginationCache = new Map<string, { data: VideoItem[]; total: number; page: number; pageSize: number; totalPages: number }>();

export function getPaginatedVideos(page: number, pageSize: number) {
  const cacheKey = `${page}-${pageSize}`;
  
  // Return cached result if available
  if (paginationCache.has(cacheKey)) {
    const cached = paginationCache.get(cacheKey);
    if (cached) {
      return cached;
    }
  }
  
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedVideos = videos.slice(startIndex, endIndex);
  const totalPages = Math.ceil(videos.length / pageSize);
  
  const result = {
    data: paginatedVideos,
    total: videos.length,
    page,
    pageSize,
    totalPages
  };
  
  // Cache the result
  paginationCache.set(cacheKey, result);
  
  // Clean up cache if it gets too large
  if (paginationCache.size > 10) {
    // Get all keys and delete the first one
    const keys = Array.from(paginationCache.keys());
    if (keys.length > 0) {
      const firstKey = keys[0];
      if (firstKey) {
        paginationCache.delete(firstKey);
      }
    }
  }
  
  return result;
}

// Clear pagination cache when videos array changes
if (typeof window !== 'undefined') {
  window.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      // Clear cache when tab becomes inactive
      paginationCache.clear();
    }
  });
};
