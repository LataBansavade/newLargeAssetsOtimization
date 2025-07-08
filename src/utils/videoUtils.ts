/**
 * Preloads a video source to improve playback performance
 * @param src The source URL of the video to preload
 * @returns A promise that resolves when the video is loaded
 */
export const preloadVideo = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (typeof document === 'undefined') {
      // Skip preloading during SSR
      return resolve();
    }

    const video = document.createElement('video');
    video.preload = 'auto';
    video.style.display = 'none';
    
    video.onloadeddata = () => {
      document.body.removeChild(video);
      resolve();
    };
    
    video.onerror = (error) => {
      document.body.removeChild(video);
      console.warn(`Failed to preload video: ${src}`, error);
      reject(error);
    };

    video.src = src;
    document.body.appendChild(video);
  });
};

/**
 * Gets the optimal video format based on browser support
 * @returns 'webm' if supported, otherwise 'mp4'
 */
export const getOptimalVideoFormat = (): 'webm' | 'mp4' => {
  if (typeof document === 'undefined') return 'mp4'; // Default to mp4 during SSR
  
  const video = document.createElement('video');
  const canPlayWebM = video.canPlayType('video/webm; codecs="vp9, opus"').replace('no', '');
  return canPlayWebM ? 'webm' : 'mp4';
};

/**
 * Creates a promise that resolves after a specified delay
 * @param ms Delay in milliseconds
 * @returns A promise that resolves after the delay
 */
export const delay = (ms: number): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms));
