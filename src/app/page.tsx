// pages/index.tsx

import Header from '@/components/header'
import ImageGrid from '../components/image-grid'
import HeroSection from '../components/landing-hero'
import Steps from '../components/landing-step-by-step'
import Footer from '@/components/footer'

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
