import Navbar from './navbar'

const Header: React.FC = () => {
  return (
    <header className="bg-green-700 text-white rounded-t-lg">
      {/* Tournament Info */}
      <div className="p-2 text-center text-xs">
        <span>Pebble Beach Pro-Am • Round 4</span> |{' '}
        <span>Thursday, February 1, 2024</span>
      </div>
      {/* Player Cards */}
      <div className="flex overflow-x-auto bg-green-800 p-1 space-x-1 scrollbar-hide">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center bg-white text-black p-2 rounded-sm shadow-md min-w-[200px] border border-gray-300"
          >
            {/* Position */}
            <p className="text-gray-600 font-semibold text-sm mr-2">
              T{(i + 1) % 6}
            </p>

            {/* Player Image */}
            <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-400 mr-1">
              <img
                src={`https://source.unsplash.com/100x100/?golfer&sig=${i}`} // Replace with real golfer images
                alt="Player"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Player Info */}
            <div className="flex-1 ml-1">
              <p className="font-bold text-sm uppercase text-gray-800">Homa</p>
              <p className="text-xs text-green-700 font-semibold flex items-center">
                -{20 - i} <span className="ml-1 text-gray-600">Thru F</span>
              </p>
            </div>

            {/* Icons */}
            <div className="flex flex-col items-center space-y-2">
              <span className="text-gray-500">
                {/* Star icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                >
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              </span>
              <span className="text-gray-500">
                {/* Flag icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                >
                  <path d="M14.4 6L13 8h5v10h2V6z" />
                </svg>
              </span>
            </div>
          </div>
        ))}
      </div>
      {/* Navbar */}
      <Navbar />
    </header>
  )
}

export default Header
