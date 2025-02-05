import ImageGrid from '../components/landing-page/landing-image-grid'
import HeroSection from '../components/landing-page/landing-hero'
import Steps from '../components/landing-page/landing-step-by-step'

export default function Home() {
  return (
    <>
      <HeroSection />
      <ImageGrid />
      <Steps />
    </>
  )
}