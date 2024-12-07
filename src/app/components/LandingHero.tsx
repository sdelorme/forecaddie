// components/HeroSection.tsx
const HeroSection: React.FC = () => {
  return (
    <section className="bg-black text-white py-20 text-center">
      <div className="container mx-auto px-4">
        <h1 className="text-5xl font-bold mb-4">
          READY TO TAKE YOUR GOLF BETTING TO THE NEXT LEVEL?
        </h1>
        <p className="mt-8">
          <button className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-6 rounded">
            Login or Sign up
          </button>
        </p>
      </div>
    </section>
  )
}

export default HeroSection
