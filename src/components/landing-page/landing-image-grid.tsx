'use server'

import Image from 'next/image'

const LandingImageGrid: React.FC = () => {
  const topImages = ['/Bones.png', '/Gretzkey.png']
  const bottomImages = ['/JT.png', '/Tiger.png']

  return (
    <section className="bg-primary rounded-[24px]">
      <div className="max-w-[95%] sm:max-w-[90%] md:max-w-[85%] mx-auto p-4 sm:p-8 md:p-12">
        {/* Top Row */}
        <div className="grid grid-cols-2 gap-4 sm:gap-8 mb-4 sm:mb-8">
          {topImages.map((src, idx) => (
            <div key={idx} className="relative aspect-[4/3] rounded-[12px] sm:rounded-[24px] overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.3)]">
              <Image
                src={src}
                alt={`Golf Image ${idx + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 45vw, (max-width: 768px) 40vw, 35vw"
              />
            </div>
          ))}
        </div>

        {/* Center Text */}
        <div className="text-center mb-4 sm:mb-8">
          <h2 className="text-secondary text-3xl sm:text-4xl font-bold mb-2 [text-shadow:_2px_2px_8px_rgb(0_0_0_/_40%)]">
            Smarter Bets.
          </h2>
          <div className="text-white text-2xl sm:text-3xl tracking-wide">
            <span className="inline-block mx-2 sm:mx-4 [text-shadow:_2px_2px_8px_rgb(0_0_0_/_40%)]">OAD.</span>
            <span className="inline-block mx-2 sm:mx-4 [text-shadow:_2px_2px_8px_rgb(0_0_0_/_40%)]">DFS.</span>
            <span className="inline-block mx-2 sm:mx-4 [text-shadow:_2px_2px_8px_rgb(0_0_0_/_40%)]">Outright.</span>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-2 gap-4 sm:gap-8">
          {bottomImages.map((src, idx) => (
            <div key={idx} className="relative aspect-[4/3] rounded-[12px] sm:rounded-[24px] overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.3)]">
              <Image
                src={src}
                alt={`Golf Image ${idx + 3}`}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 45vw, (max-width: 768px) 40vw, 35vw"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default LandingImageGrid
