import Image from 'next/image'
import Link from 'next/link'

const Navbar: React.FC = () => {
  return (
    <nav className="flex justify-between items-center p-3 bg-green-700">
      {/* Left Section: Logo and Navigation Links */}
      <div className="flex items-center space-x-12">
        {/* Logo */}
        <Link href="/">
          <Image
            src="/CaddieBetLogo.png" // Replace with your actual logo path
            alt="CaddieBet"
            width={150}
            height={50}
            className="cursor-pointer"
          />
        </Link>
        {/* Navigation Links */}
        <ul className="flex items-center space-x-6">
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
        </ul>
      </div>

      {/* Right Section: Log in | Join */}
      <div className="flex items-center space-x-2">
        <Link href="/login" className="hover:underline text-white">
          Log in
        </Link>
        <span className="text-white">|</span>
        <Link href="/signup" className="hover:underline text-white">
          Sign Up
        </Link>
      </div>
    </nav>
  )
}

export default Navbar

export default Navbar
