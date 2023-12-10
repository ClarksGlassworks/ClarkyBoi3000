import Image from 'next/image'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between hash-lines z-10">
      <div className="layer1 min-h-screen w-full h-full z-20 fixed left-0 right-0 top-0 bottom-0"></div>
      <Image 
        src="https://wp.clarksglassworks.com/wp-content/uploads/2023/12/clark-tape.png" 
        alt="Clark Tape" 
        width={500} 
        height={300}
        className='z-30 relative'
      />
      <Image 
        src="https://wp.clarksglassworks.com/wp-content/uploads/2023/12/corner-leopard.png" 
        alt="Corner Leopard" 
        width={500} 
        height={300}
        className='z-30 relative'
      />
      <Image 
        src="https://wp.clarksglassworks.com/wp-content/uploads/2023/12/gameboy-7.png" 
        alt="Gameboy" 
        width={500} 
        height={300}
        className='z-30 relative'
      />
    </main>
  )
}
