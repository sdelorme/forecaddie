import Link from 'next/link'

const Navbar: React.FC = () => {
  return (
    <nav className="flex justify-between items-center p-4 bg-green-700">
      <ul className="flex space-x-6">
        <li>
          <Link href="/" className="text-white hover:underline">
            Home
          </Link>
        </li>
        <li>
          <Link href="/odds" className="text-white hover:underline">
            Odds
          </Link>
        </li>
        <li>
          <Link href="/pga-tour-info" className="text-white hover:underline">
            PGA Tour Info
          </Link>
        </li>
        <li>
          <Link href="/login" className="text-white hover:underline">
            Login
          </Link>
        </li>
      </ul>
      <div>
        <Link href="/signup">
          <button className="bg-yellow-500 hover:bg-yellow-600 text-black py-2 px-4 rounded">
            Sign Up
          </button>
        </Link>
      </div>
    </nav>
  )
}

export default Navbar
