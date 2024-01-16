import { useEffect, useState, useRef, memo } from 'react';
import { motion, useTransform, useScroll } from 'framer-motion';
// import Image from 'next/image';
import animatedBg from './bg.svg';
//@ts-ignore
const Casette = memo(({isScrolled, scrollYProgress, casetteScale, casetteRotate, casetteX, casetteY, ref, isMobile}) => {
 
  
  const imageRef = useRef(null);
  const [imageWidth, setImageWidth] = useState(0);



  return (
	<>
	<div className=''>
    <motion.div
      className={`z-40 h-[300px] fixed p-4 ml-2 transition-all duration-300 ${isScrolled ? '':'animate-float'}`}
	  ref={ref}
	  id={'casette'}
      style={{
        scale: isScrolled ? casetteScale : 1,
        rotate: casetteRotate,
        // bottom: isScrolled ? 'auto' : '10%',
        top: isMobile ? casetteY : 'auto',
		bottom: isMobile ? 'auto' :casetteY,
        left: casetteX,
      }}
    >
      <img
        ref={imageRef}
        src="https://wp.clarksglassworks.com/wp-content/uploads/2023/12/clark-tape.png"
        alt="Clark Tape"
        width={500}
        height={300}
        className="z-50 cursor-pointer relative"
      />
	
    </motion.div>
	  <motion.div
	  className='bg-teal-500   w-full h-[90px] z-30 fixed left-0 right-0 top-0 shadow-xl animated transition-all delay-200 duration-300  border-b-4 border-white border-'
	  
	  style={
		{
			top: isScrolled ? 0 : '-50px',
			opacity: isScrolled ? 1 : 0,
		}
	  }
	  >

		<section className='w-full h-full flex justify-between items-center'>
			<div></div>
			<div className='text-white pr-8 opacity-50'>

		Cart Empty</div>
		</section>
	  </motion.div>
	  </div>
	  </>
  );
});

export default Casette;
