'use client'
import { useState, useEffect, useRef, memo } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";

const Gamebody = memo(({ isScrolled, scrollYProgress, gameboyContainerScale, gameboyContainerRotate, gameboyContainerX, gameboyContainerY, ref, isMobile }) => {

  console.log('gameboy', isScrolled)
  const [gameboyRotation, setGameboyRotation] = useState(20);
  const [gameboyScale, setGameboyScale] = useState(0.8)
  const [isGameboyRotated, setIsGameboyRotated] = useState(false);
  const [animationClass, setAnimationClass] = useState("opacity-0");
  const [overlayOpacity, setOverlayOpacity] = useState('opacity-50');
  const [position, setPosition] = useState({ x: 2000, y: 2000 });
  const [currentImage, setCurrentImage] = useState(0);
  const [titleOpacity, setTitleOpacity] = useState(100);
  const gameboyRef = useRef(null);
  const timerRef = useRef(null);
  // const { scrollYProgress } = useScroll();
  const imageRef = useRef(null);
  const [imageWidth, setImageWidth] = useState(0);


  const [nextImage, setNextImage] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage(nextImage);
      setNextImage((nextImage + 1) % gameboyImages.length);
    }, 3000); // Change image every 3 seconds
    // Clean up on component unmount
    return () => {
      clearInterval(timer);
    };
  }, [nextImage]);



  useEffect(() => {
    const handleClickOutside = (event) => {
      // @ts-ignore
      if (gameboyRef.current && !gameboyRef.current.contains(event.target)) {
        handleGameboyClick();
      }
    };
    if (isGameboyRotated) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isGameboyRotated])


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

  useEffect(() => {
    setAnimationClass("opacity-100");
    setPosition({
      x: window.innerWidth - 300, // Subtract half the width of the image
      y: window.innerHeight - 430, // Subtract half the height of the image
    });
  }, []);

  const handleGameboyClick = () => {
    if (!isGameboyRotated) {
      // setGameboyRotation(0);
      // setGameboyScale(1.5)
      setAnimationClass("");

      // clearInterval(timerRef.current);

      // setNextImage('https://example.com/fixed-image-url.jpg');
      // setPosition({
      //   x:
      //     window.innerWidth /
      //     (window.matchMedia("(max-width: 768px)").matches ? 2 : 1.5) -
      //     (window.matchMedia("(max-width: 768px)").matches ? 150 : 300),
      //   y:
      //     window.innerHeight /
      //     (window.matchMedia("(max-width: 768px)").matches ? 2 : 1.5) -
      //     (window.matchMedia("(max-width: 768px)").matches ? 215 : 350),
      // });


      setTitleOpacity(0)

      setTimeout(() => {

        // setGameboyScale((window.matchMedia("(max-width: 768px)").matches ? 2.5 : 4))
        // setPosition({
        //   x:
        //     window.innerWidth /
        //     (window.matchMedia("(max-width: 768px)").matches ? 2 : 1.5) -
        //     (window.matchMedia("(max-width: 768px)").matches ? 125 : 300),
        //   y:
        //     window.innerHeight /
        //     (window.matchMedia("(max-width: 768px)").matches ? 2 : 1.5) -
        //     (window.matchMedia("(max-width: 768px)").matches ? 120 : -80),
        // });
        // setOverlayOpacity('opacity-100')
      }, 500)

    } else {

      // setGameboyRotation(20);
      // setGameboyScale(0.8)
      setAnimationClass("");

      setTitleOpacity(100)

      // setOverlayOpacity('opacity-50')
      // setPosition({
      //   x: window.innerWidth - 300, // Subtract half the width of the image
      //   y: window.innerHeight - 430, // Subtract half the height of the image
      // });


    }

    setIsGameboyRotated(!isGameboyRotated);
  };









  return (
    <motion.div
      style={{
        scale: isScrolled ? gameboyContainerScale : isMobile ? 0.6 : 0.5,
        rotate: isScrolled ? gameboyContainerRotate : 20,
        bottom: isScrolled ? '-30%' : '-25%',
        right: isScrolled ? isMobile ? '-25%' : '25%' : isMobile ? '-15%': '15%',
        // top: scrollYProgress * 100,
        // left: 300 + (gameboyContainerX),
        zIndex: 100,
      }}
      id='gameboyContainer'
      ref={ref}
      className="fixed w-full h-full cursor-pointer overflow-hidden max-w-[300px] max-h-[600px]" >
      <div
        // style={{ left: `${position.x}px`, top: `${position.y}px`, transform: `rotate(${gameboyRotation}deg)  translateX(${isGameboyRotated ? '0px' : '50px'})`, }}
        onClick={handleGameboyClick}
        ref={gameboyRef}
        className={`z-30 ${animationClass} transition-all duration-500`}
      >
        <Image
          src="https://wp.clarksglassworks.com/wp-content/uploads/2023/12/gameboy-7.png"
          alt="Gameboy"
          width={500}
          height={300}
          className="w-[300px] z-30 relative"
        />
        <div className="absolute top-[60px] left-[60px] z-20 flex items-center justify-center h-[150px] w-[150px] overflow-hidden bg-green-800">
          <div className={``}>


            <AnimatePresence>
              <motion.div className={`z-50 flex items-center justify-center text-center mx-auto top-[10%] left-[13%] absolute flex-col font-mono`}
                initial={{ opacity: 1, y: 0 }}
                animate={{ opacity: isGameboyRotated ? 1 : 0 }}
                exit={{ opacity: 0, y: 50 }}
                transition={{ duration: 0.5, delay: isGameboyRotated ? 1 : 0 }}
                key={'gameboyTitle'}
              >
                Menu 👀
                <div className="w-full text-left place-self-start justify-self-start">

                  <p className="text-xs underline text-blue-700 mb-1">1. Shop-the-gear</p>

                  <p className="text-xs underline text-blue-700 mb-1">2. About-me.mp3</p>

                  <p className="text-xs underline text-blue-700 mb-1">3. Wholesalin</p>
                  <p className="text-xs underline text-blue-700">4. Contact.exe</p>
                </div>

              </motion.div>

              <motion.div className={`z-50 flex items-center justify-center text-center mx-auto top-[40%] left-[25%] absolute flex-col font-mono`}
                initial={{ opacity: 1, y: 0 }}
                animate={{ opacity: isGameboyRotated ? 0 : 1 }}
                exit={{ opacity: 0, y: 50 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                key={'gameboyScreen'}
              >
                Game Over
                <div className="w-full">
                  <span className="text-[10px] opacity-50 animated absolute w-full left-0">
                    Click for menu{" "}
                  </span>
                  <span className="text-[10px] opacity-50 animated animate-ping absolute w-full left-0">
                    Click for menu{" "}
                  </span>
                </div>
              </motion.div>

              <motion.div
                className={`z-40 bg-black w-full h-full absolute left-0 top-0 right-0 bottom-0 font-mono`}
                initial={{ opacity: 0 }}
                animate={{ opacity: isGameboyRotated ? 1 : 0 }}
                exit={{ opacity: 0 }}
                key="gameboyOverlay"
                transition={{ duration: 0.5, delay: 1 }}

              ></motion.div>
            </AnimatePresence>


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
    </motion.div>
  );
})

export default Gamebody
