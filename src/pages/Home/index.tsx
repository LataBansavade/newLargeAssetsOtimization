import { lazy, Suspense } from 'react';
import Hero from "../../components/Hero"
// Lazy load components that are only needed on this page
// const Hero = lazy(() => import('../../components/Hero'));
const VideoGallery = lazy(() => import('../../components/VideoGallery'));
const FeaturedVideos = lazy(() => import('../../components/FeaturedVideos'));
const FullScaleVideo = lazy(() => import('../../components/FullScaleVideo'));
const Quotes = lazy(() => import('../../components/Quotes'));
const VideoSlider = lazy(() => import('../../components/videoslider'));

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
  </div>
);

export default function Home() {
  return (
    <div>
       <Hero />
  
    <Suspense fallback={<LoadingSpinner />}>
      <div className="bg-black">
       
        <VideoGallery />
        <FeaturedVideos />
        <FullScaleVideo />
        <Quotes />
        <VideoSlider />
      </div>
    </Suspense>
      </div>
  );
}
