import Image from 'next/image'
import { Star, Flag } from 'lucide-react'

export default function LeaderboardScroll() {
  return (
    <div className="w-full bg-white">
      <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 p-4 scrollbar-hide">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="flex-none snap-center w-[240px] p-4 border rounded-lg"
          >
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute -top-1 -left-1 bg-white text-xs font-semibold px-1.5 py-0.5 rounded-sm z-10">
                  T1
                </div>
                <div className="relative w-12 h-12 rounded-full overflow-hidden">
                  <Image
                    src={'/placeholder.svg'}
                    alt={'hi'}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm">Homa</span>
                  <Star className="w-4 h-4 text-gray-400" />
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-red-600 font-semibold">-15</span>
                  <span className="text-xs text-gray-500">Thru F</span>
                  <Flag className="w-3 h-3 text-gray-400 ml-auto" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
