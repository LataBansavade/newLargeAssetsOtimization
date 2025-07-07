// Fix for NodeJS.Timeout type
type Timeout = ReturnType<typeof setTimeout>;

declare global {
  // Extend the Window interface
  interface Window {
    Spline: any; // Add proper type if available
  }
  
  // Extend the Document interface for fullscreen API
  interface Document {
    webkitFullscreenElement?: Element | null;
    mozFullScreenElement?: Element | null;
    msFullscreenElement?: Element | null;
    webkitExitFullscreen?: () => Promise<void>;
    mozCancelFullScreen?: () => Promise<void>;
    msExitFullscreen?: () => Promise<void>;
  }
  
  // Extend the HTMLElement interface for fullscreen API
  interface HTMLElement {
    webkitRequestFullscreen?: () => Promise<void>;
    mozRequestFullScreen?: () => Promise<void>;
    msRequestFullscreen?: () => Promise<void>;
  }
}

// Export the Timeout type for use in other files
export type { Timeout };
