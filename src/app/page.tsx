import ImageGrid from './(landing)/(components)/landing-image-grid'
import HeroSection from './(landing)/(components)/landing-hero'
import Steps from './(landing)/(components)/landing-step-by-step'

export default function Home() {
  return (
    <>
      <HeroSection />
      <ImageGrid />
      <Steps />
    </>
  )
}
