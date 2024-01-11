"use client";
import Image from "next/image";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [gameboyRotation, setGameboyRotation] = useState('rotate-[20deg]');
  const [isGameboyRotated, setIsGameboyRotated] = useState(false);
  const [animationClass, setAnimationClass] = useState("opacity-0");
  const [position, setPosition] = useState({ x: 2000, y: 2000 });
  const [currentImage, setCurrentImage] = useState(0);
  useEffect(() => {
    setAnimationClass("opacity-100");
    setPosition({
      x: window.innerWidth - 300, // Subtract half the width of the image
      y: window.innerHeight - 430, // Subtract half the height of the image
    });
  }, []);

  const [nextImage, setNextImage] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage(nextImage);
      setNextImage((nextImage + 1) % gameboyImages.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(timer); // Clean up on component unmount
  }, [nextImage]);


  const gameboyImages = [
    'https://wp.clarksglassworks.com/wp-content/uploads/2024/01/406843489_10224453376305909_4200315121223775507_n-249x300.jpg',
    'https://wp.clarksglassworks.com/wp-content/uploads/2024/01/406242813_10224453376505914_7619948699842207230_n-226x300.jpg',
    'https://wp.clarksglassworks.com/wp-content/uploads/2024/01/406256733_10224453376105904_7503758711031315498_n-1-300x291.jpg',
    'https://wp.clarksglassworks.com/wp-content/uploads/2024/01/406339932_10224453376425912_8431945766142961895_n-2-300x288.jpg',
    'https://wp.clarksglassworks.com/wp-content/uploads/2024/01/406244967_10224453376065903_4386710781484094465_n-241x300.jpg',
  ];

  const variants = {
    initial: { opacity: 0, scale: 1.2 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
  };



  const handleGameboyClick = () => {
    if (isGameboyRotated) {
      setGameboyRotation('rotate-[0deg]');
      setAnimationClass("");
      setPosition({
        x:
          window.innerWidth /
          (window.matchMedia("(max-width: 768px)").matches ? 2 : 1.5) -
          (window.matchMedia("(max-width: 768px)").matches ? 150 : 300),
        y:
          window.innerHeight /
          (window.matchMedia("(max-width: 768px)").matches ? 2 : 1.5) -
          (window.matchMedia("(max-width: 768px)").matches ? 215 : 430),
      });
    } else {
      setGameboyRotation('rotate-[20deg]');
      setAnimationClass("");
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
      <div
        id="canvas-container"
        className="w-full h-screen z-30 "
      >
        <div style={{ width: "100vw", height: "100vh" }}></div>
      </div>

      <Image
        src="https://wp.clarksglassworks.com/wp-content/uploads/2023/12/corner-leopard.png"
        alt="Corner Leopard"
        width={500}
        height={300}
        className="z-30 fixed top-0 right-0"
      />
      <div className="z-30 fixed bottom-auto lg:bottom-10 top-24 lg:top-auto left-6 lg:left-20 animate-float">
        <Image
          src="https://wp.clarksglassworks.com/wp-content/uploads/2023/12/clark-tape.png"
          alt="Clark Tape"
          width={500}
          height={300}
          className="z-30 cursor-pointer scale-100 lg:scale-75"
        />
      </div>

      <div className="absolute w-full h-full flex items-center justify-center cursor-pointer">
        <div
          style={{ left: `${position.x}px`, top: `${position.y}px` }}
          onClick={handleGameboyClick}
          className={`z-30 fixed ${gameboyRotation} ${animationClass} transition-all duration-500`}
        >
          <Image
            src="https://wp.clarksglassworks.com/wp-content/uploads/2023/12/gameboy-7.png"
            alt="Gameboy"
            width={500}
            height={300}
            className="w-[300px] z-30 relative"
          />
          <div className="absolute top-[60px] left-[60px] z-20 flex items-center justify-center h-[150px] w-[150px] overflow-hidden bg-green-800">
            <div className="">
              <div className="z-50 flex items-center justify-center text-center mx-auto top-[40%] left-[25%] absolute flex-col font-mono">
                Game Over
                <div className="w-full">
                  <span className="text-[10px] opacity-50 animated absolute w-full left-0">
                    Click for menu{" "}
                  </span>
                  <span className="text-[10px] opacity-50 animated animate-ping absolute w-full left-0">
                    Click for menu{" "}
                  </span>
                </div>
              </div>
              <div className="z-40 bg-black opacity-50 w-full h-full absolute left-0 top-0 right-0 bottom-0 font-mono"></div>


              <AnimatePresence mode="popLayout">
                <motion.img
                  key={gameboyImages[currentImage]}
                  src={gameboyImages[currentImage]}
                  className=""
                  variants={variants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.5 }}
                />
              </AnimatePresence>

            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
