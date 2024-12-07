// pages/index.tsx

import Footer from './components/Footer'
import Header from './components/Header'
import ImageGrid from './components/ImageGrid'
import HeroSection from './components/LandingHero'
import Steps from './components/LandingStepByStep'

const Home: React.FC = () => {
  return (
    <>
      <Header />
      <HeroSection />
      <ImageGrid />
      <Steps />
      <Footer />
    </>
  )
}

export default Home
