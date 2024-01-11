'use client'
import Image from 'next/image'

import { useEffect, useRef, useState } from 'react'

export default function Home() {
  const [gameboyRotation, setGameboyRotation] = useState(20);
  const [isGameboyRotated, setIsGameboyRotated] = useState(false);
  const [animationClass, setAnimationClass] = useState('opacity-0');
  const [position, setPosition] = useState({ x: 2000, y: 2000 });
  useEffect(() => {
    setAnimationClass('opacity-100');
    setPosition({
      x: window.innerWidth - 300, // Subtract half the width of the image
      y: window.innerHeight - 430, // Subtract half the height of the image
    });
  }, []);

  

  const handleGameboyClick = () => {
    if (isGameboyRotated) {
      setGameboyRotation(0);
      setAnimationClass('');
     setPosition({
  x: window.innerWidth / (window.matchMedia("(max-width: 768px)").matches ? 2 : 1.5) - (window.matchMedia("(max-width: 768px)").matches ? 150 : 300),
  y: window.innerHeight / (window.matchMedia("(max-width: 768px)").matches ? 2 : 1.5) - (window.matchMedia("(max-width: 768px)").matches ? 215 : 430),
});
    } else {
      setGameboyRotation(20);
      setAnimationClass('');
      setPosition({
        x: window.innerWidth - 300, // Subtract half the width of the image
        y: window.innerHeight - 430, // Subtract half the height of the image
      });
    }


    setIsGameboyRotated(!isGameboyRotated);
  };
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className="hash-lines min-h-screen w-full h-full z-20 fixed left-0 right-0 top-0 bottom-0"></div>
      <div className="layer1 min-h-screen w-full h-full z-20 fixed left-0 right-0 top-0 bottom-0"></div>
      <div id="canvas-container" className='w-full h-screen z-30 '>
        <div style={{ width: "100vw", height: "100vh" }}>

        </div>
      </div>

      <Image
        src="https://wp.clarksglassworks.com/wp-content/uploads/2023/12/corner-leopard.png"
        alt="Corner Leopard"
        width={500}
        height={300}
        className='z-30 fixed top-0 right-0'
      />
      <div className='z-30 fixed bottom-auto lg:bottom-10 top-24 lg:top-auto left-6 lg:left-20 animate-float'>
      <Image
        src="https://wp.clarksglassworks.com/wp-content/uploads/2023/12/clark-tape.png"
        alt="Clark Tape"
        width={500}
        height={300}
        className='z-30 cursor-pointer scale-100 lg:scale-75'
      />
      </div>



      <div className="absolute w-full h-full flex items-center justify-center cursor-pointer">
        <div style={{ left: `${position.x}px`, top: `${position.y}px` }} onClick={handleGameboyClick} className={`z-30 fixed rotate-[${gameboyRotation}deg] ${animationClass} transition-all duration-500`}>
          <Image
            src="https://wp.clarksglassworks.com/wp-content/uploads/2023/12/gameboy-7.png"
            alt="Gameboy"
            width={500}
            height={300}
            className='w-[300px]'
          />
        </div>
      </div>

      {/* <div onClick={handleGameboyClick} className={`z-30 cursor-pointer  left-[${position.x}px] top-[${position.y}px] fixed transition-all duration-500 `}>
       <div className='relative'>
         <Image
          src="https://wp.clarksglassworks.com/wp-content/uploads/2023/12/gameboy-7.png"
          alt="Gameboy"
          width={500}
          height={300}
          className='z-30 relative scale-50'
        />




      <div className='absolute top-10 left-20 z-10 right-10 scale-50'>
        <Image
          src="https://wp.clarksglassworks.com/wp-content/uploads/2024/01/406843489_10224453376305909_4200315121223775507_n-249x300.jpg"
          alt="screen1"
          width={300}
          height={249}
          className='z-10 '
        />
        <Image
          src="https://wp.clarksglassworks.com/wp-content/uploads/2024/01/406242813_10224453376505914_7619948699842207230_n-226x300.jpg"
          alt="screen1"
          width={300}
          height={249}
          className='z-10 '
        />
        <Image
          src="https://wp.clarksglassworks.com/wp-content/uploads/2024/01/406256733_10224453376105904_7503758711031315498_n-1-300x291.jpg"
          alt="screen1"
          width={300}
          height={249}
          className='z-10 '
        />
        <Image
          src="https://wp.clarksglassworks.com/wp-content/uploads/2024/01/406339932_10224453376425912_8431945766142961895_n-2-300x288.jpg"
          alt="screen1"
          width={300}
          height={249}
          className='z-10 '
        />
        <Image
          src="https://wp.clarksglassworks.com/wp-content/uploads/2024/01/406244967_10224453376065903_4386710781484094465_n-241x300.jpg"
          alt="screen1"
          width={300}
          height={249}
          className='z-10 '
        />
        </div>
        </div> 
      </div>*/}
    </main>
  )
}
