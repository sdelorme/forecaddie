import Link from 'next/link'
import Image from 'next/image'

const Footer: React.FC = () => {
  return (
    <footer className="bg-primary text-white py-8 text-center rounded-b-lg">
      <div className="flex justify-center items-center">
        <Link href="/" className="flex-shrink-0">
          <Image src="/CaddieBetLogo.png" alt="CaddieBet" width={120} height={80} className="cursor-pointer" />
        </Link>
      </div>
    </footer>
  )
}

export default Footer
