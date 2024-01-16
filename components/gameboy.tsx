'use client'
import { useState, useEffect, useRef, memo } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
const gameboyImages = [
  'https://wp.clarksglassworks.com/wp-content/uploads/2024/01/fxk4.gif',
  // 'https://wp.clarksglassworks.com/wp-content/uploads/2024/01/406843489_10224453376305909_4200315121223775507_n-249x300.jpg',
  // 'https://wp.clarksglassworks.com/wp-content/uploads/2024/01/406242813_10224453376505914_7619948699842207230_n-226x300.jpg',
  // 'https://wp.clarksglassworks.com/wp-content/uploads/2024/01/406256733_10224453376105904_7503758711031315498_n-1-300x291.jpg',
  // 'https://wp.clarksglassworks.com/wp-content/uploads/2024/01/406339932_10224453376425912_8431945766142961895_n-2-300x288.jpg',
  // 'https://wp.clarksglassworks.com/wp-content/uploads/2024/01/406244967_10224453376065903_4386710781484094465_n-241x300.jpg',
];

//@ts-ignore
const Gamebody = memo(({ gameboyState, scrollState, ref, isMobile, setMenuActive }) => {

  const { x, y, rotate, scale } = gameboyState
  const gameboyWidth = 280
  const gameboyHeight = 440

  const isScrolled = scrollState === 'scrolling'


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
      // Check if the clicked element is a Link component
      if (event.target.closest('a')) {
        return;
      }
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
      setMenuActive(true)
      setAnimationClass("");
      setTitleOpacity(0)
    } else {
      setAnimationClass("");
      setMenuActive(false)
      setTitleOpacity(100)
    }

    setIsGameboyRotated(!isGameboyRotated);
  };

  const handleInnerDivClick = (event) => {
    event.stopPropagation();
  };



  return (
    <motion.div
      style={{
        scale: scale,
        rotate: rotate,
        bottom: y,
        right: x,
        zIndex: 100,
      }}
      id='gameboyContainer'
      ref={ref}
      onClick={()=> {handleGameboyClick()}}
      className={`fixed cursor-pointer overflow-hidden transition-all duration-500 w-[${gameboyWidth}px] h-[${gameboyHeight}px]`} >
      <div
        ref={gameboyRef}
        className={`z-30 ${animationClass} transition-all duration-500`}
      >
        <Image
          src="https://wp.clarksglassworks.com/wp-content/uploads/2023/12/gameboy-7.png"
          alt="Gameboy"
          width={500}
          height={300}
          className="w-[300px] z-30 relative select-none"
        />
        <div className="absolute top-[66px] left-[69px] z-[999] flex items-center justify-center h-[133px] w-[142px] overflow-hidden bg-green-800 shadow-inner shadow-black">
          <div className={`disable-click-bubling`} onClick={handleInnerDivClick}>

            <Image src={'https://wp.clarksglassworks.com/wp-content/uploads/2024/01/fxk4.gif'} alt="" width="600" height={400} />
            <AnimatePresence>
              <motion.div className={`z-[999] flex items-center justify-center text-center mx-auto top-[2%] left-[18%] absolute flex-col text-white font-vt323`}
                initial={{ opacity: 1, y: 0 }}
                animate={{ opacity: isGameboyRotated ? 1 : 0 }}
                exit={{ opacity: 0, y: 50 }}
                transition={{ duration: 0.5, delay: isGameboyRotated ? 1 : 0 }}
                key={'gameboyTitle'}
                // onClick={(e) => { e.stopPropagation(); console.log('goo oogogogo') }}
              >
                Menu 👀
                <div className="w-full text-left place-self-start justify-self-start flex flex-col gap-0" >

                  <Link href="/shop" className="z-[999] relative" onClick={(e) => { e.stopPropagation(); console.log('goo oogogogo') }}><p className="text-sm underline text-blue-700 font-vt323">1. Shop-the-gear</p></Link>

                  <p className="text-sm underline text-blue-700 font-vt323">2. Custom Order</p>
                  <p className="text-sm underline text-blue-700  font-vt323">3. About-me.mp3</p>

                  <p className="text-sm underline text-blue-700  font-vt323">4. Wholesalin</p>
                  <p className="text-sm underline text-blue-700 font-vt323">5. Contact.exe</p>
                </div>

              </motion.div>

              <motion.div className={`z-50 flex items-center justify-center text-center mx-auto top-[40px] left-[26px] absolute flex-col font-vt323 text-white text-2xl`}
                initial={{ opacity: 1, y: 0 }}
                animate={{ opacity: isGameboyRotated ? 0 : 1 }}
                exit={{ opacity: 0, y: 50 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                key={'gameboyScreen'}
              >
                <span className=" text-white text-[30px] font-vt323">Game Over</span>
                <div className="w-full">
                  <span className="text-[35px] opacity-100 animated absolute w-full left-0  text-white font-vt323 font-thin">
                    MENU{" "}
                  </span>
                  <span className="text-[35px] opacity-50 animated animate-ping absolute w-full left-0 text-white font-vt323 font-thin">
                    MENU{" "}
                  </span>
                </div>
              </motion.div>

              <motion.div
                className={`z-40 bg-black w-full h-full absolute left-0 top-0 right-0 bottom-0 font-mono grayscale-1`}
                initial={{ opacity: 1 }}
                animate={{ opacity: isGameboyRotated ? 0.8 : 0.5 }}
                exit={{ opacity: 0 }}
                key="gameboyOverlay"
                transition={{ duration: 0.5, delay: 1 }}

              ></motion.div>
            </AnimatePresence>
            <Image src={'https://wp.clarksglassworks.com/wp-content/uploads/2024/01/fxk4.gif'} alt="" fill />

            {/* <AnimatePresence mode="popLayout">
              <motion.img
                key={gameboyImages[currentImage]}
                src={'https://wp.clarksglassworks.com/wp-content/uploads/2024/01/fxk4.gif'}
                className=""
                // variants={variants}
                // initial="initial"
                // animate="animate"
                // exit="exit"
                transition={{ duration: 0.5 }}
              />
            </AnimatePresence> */}

          </div>
        </div>
      </div>
    </motion.div>
  );
})

export default Gamebody
