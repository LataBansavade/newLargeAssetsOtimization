import Hero from "./Componenets/Hero"
import FeaturedVideos from "./Componenets/FeaturedVideos"
import FullScaleVideo from "./Componenets/FullScaleVideo"
import VideoGrid from "./Componenets/VideoGrid"
import Quotes from "./Componenets/Quotes"
import VideoSlider from "./Componenets/videoslider"
import Footer from "./Componenets/Footer"

const App = () => {
 

  return (
    <div className="bg-black">
      <Hero/>
      <FeaturedVideos/>
      <FullScaleVideo/>
      <VideoGrid/>
      <Quotes/>
      <VideoSlider/>
      <Footer/>
    </div>    
  )
}

export default App