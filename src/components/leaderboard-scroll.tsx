import Image from 'next/image'
import { Star, Flag } from 'lucide-react'

export default function LeaderboardScroll() {
  return (
    <div className="flex overflow-x-auto snap-x snap-mandatory gap-2 sm:gap-6 p-2 sm:p-6 scrollbar-hide bg-primary">
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={i}
          className="flex-none snap-center bg-white text-black sm:p-6 rounded-xl shadow-sm min-w-[64px] sm:min-w-[320px] border border-gray-100"
        >
          {/* Mobile Layout */}
          <div className="block sm:hidden relative">
            <div className="w-16 h-16 rounded-full overflow-hidden relative">
              <Image
                src="/homa-no-bg.png"
                alt="Player"
                fill
                className="object-cover"
                sizes="64px"
              />
            </div>
            <div className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-semibold px-1.5 py-0.5 rounded-full">
              -11
            </div>
            <div className="text-center mt-1">
              <p className="text-[10px] font-semibold text-gray-600">{i + 1}. HOMA</p>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden sm:flex items-start">
            <span className="text-gray-600 font-semibold text-base mr-6">T{i + 1}</span>
            <div className="w-16 h-16 rounded-full overflow-hidden relative mr-6">
              <Image
                src="/homa-no-bg.png"
                alt="Player"
                fill
                className="object-cover"
                sizes="64px"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <span className="font-bold text-xl">HOMA</span>
                <div className="flex flex-col space-y-3">
                  <Star className="w-5 h-5 text-gray-300 stroke-[1.5]" />
                  <Flag className="w-5 h-5 text-gray-300 stroke-[1.5]" />
                </div>
              </div>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-primary font-semibold text-lg">-20</span>
                <span className="text-gray-400 text-sm">Thru F</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
