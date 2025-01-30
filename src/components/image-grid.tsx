import Image from 'next/image'

const ImageGrid: React.FC = () => {
  const images = [
    '/Bones.png',
    '/Gretzkey.png',
    '/JT.png',
    '/Tiger.png', // Replace these paths with your actual image paths in the public/ folder
  ]

  return (
    <section className="bg-green-700 text-white py-4">
      <div className="container mx-auto px-4">
        <p className="text-center text-xl pb-2">
          Smarter Bets. OAD. DFS. Outright.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {images.map((src, idx) => (
            <div key={idx} className="relative aspect-w-4 aspect-h-3">
              <Image
                src={src}
                alt={`Image ${idx + 1}`}
                fill
                style={{ objectFit: 'cover' }}
                className="rounded shadow-md"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ImageGrid
