'use server'

import Image from 'next/image';

const HeroSection: React.FC = () => {
  return (
    <section className="relative bg-black text-white flex items-center justify-center text-center overflow-hidden min-h-[40vh] sm:min-h-[50vh] lg:min-h-[60vh] px-4 sm:px-6 lg:px-12 py-6 sm:py-12 lg:py-16">  
      <div className="absolute inset-0 -z-0">
        <Image
          src="/arrow.png" // Ensure this path is correct
          alt="Background Arrow"
          layout="responsive"
          width={16} // Aspect ratio: width
          height={9}
          className="opacity-20 pointer-events-none"
        />
      </div>

      <div className="container mx-auto px-4">
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-left w-2/3 max-w-[66%]">
      <span className="text-white">READY TO TAKE YOUR GOLF </span>
          <span className="text-green-200">BETTING TO THE NEXT LEVEL?</span>
        </h1>
      </div>
    </section>
  );
};

export default HeroSection;