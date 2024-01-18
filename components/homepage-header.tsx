import { useEffect, useState, useRef, memo } from 'react';
import { motion, useTransform, useScroll } from 'framer-motion';
import Image from 'next/image';
import animatedBg from './bg.svg';
import ShoppingCartButton from './shoppingCartButton';
import Casette from './casette';
//@ts-ignore
const HomepageHeader = memo(({ casetteState, ref, isMobile, scrollState, headerBarState }) => {


  const { x, y, rotate, scale, mobileX, mobileY } = casetteState
  const { height } = headerBarState

  const isScrolled = scrollState === 'scrolling' || scrollState === 'end'
  const imageRef = useRef(null);
  const [imageWidth, setImageWidth] = useState(0);



  return (
    <>
      <div className=''>
       
       <Casette casetteState={casetteState} />
        {isMobile && (<motion.div
          className={`bg-teal-500   w-full h-[${height}px] z-30 fixed left-0 right-0 top-0 shadow-xl animated transition-all delay-200 duration-300  border-b-4 border-white overflow-hidden`}

          style={
            {
              top: isScrolled ? 0 : '-50px',
              opacity: isScrolled ? 1 : 0,
              height: `${height}px`
            }
          }
        >
          <Image src="https://wp.clarksglassworks.com/wp-content/uploads/2024/01/7SGv.gif" alt="" width={500} height={300} className='absolute z-20 opacity-50' />
          <section className='w-full h-full flex justify-between items-center z-40 absolute'>
            <div></div>
            <ShoppingCartButton className={`text-white mr-2 opacity-100 bg-black rounded-full text-center p-2 max-w-[200px]`} text="Cart Empty" />
          </section>
        </motion.div>)}
      </div>
    </>
  );
});

export default HomepageHeader;
