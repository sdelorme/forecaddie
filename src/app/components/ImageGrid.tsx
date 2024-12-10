import Image from 'next/image'

const ImageGrid: React.FC = () => {
  const images = [
    '/Bones.png',
    '/Gretzkey.png',
    '/JT.png',
    '/Tiger.png', // Replace these paths with your actual image paths in the public/ folder
  ]

  return (
    <section className="bg-green-700 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {images.map((src, idx) => (
            <div key={idx} className="relative w-full h-48">
              <Image
                src={src}
                alt={`Image ${idx + 1}`}
                layout="fill" // Ensures the image covers the container
                objectFit="cover" // Maintains aspect ratio and covers the container
                className="rounded shadow-md"
              />
            </div>
          ))}
        </div>
        <p className="text-center text-xl">Smarter Bets. OAD. DFS. Outright.</p>
      </div>
    </section>
  )
}

export default ImageGrid
