// components/Header.tsx

import Navbar from './Navbar'

const Header: React.FC = () => {
  return (
    <header className="bg-green-700 text-white rounded-t-lg">
      {/* Tournament Info */}
      <div className="p-2 text-center text-sm">
        <span>Pebble Beach Pro-Am • Round 4</span> |{' '}
        <span>Thursday, February 1, 2024</span>
      </div>
      {/* Player Cards */}
      <div className="flex overflow-x-auto bg-green-800 p-2">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="text-center mx-2 bg-white text-black p-2 rounded shadow-md min-w-[100px]"
          >
            <p className="font-bold">MCILROY</p>
            <p>T{(i + 1) % 6}</p>
            <p>-{20 - i}</p>
          </div>
        ))}
      </div>
      {/* Navbar */}
      <Navbar />
    </header>
  )
}

export default Header
