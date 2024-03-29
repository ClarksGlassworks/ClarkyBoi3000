import { motion } from 'framer-motion'
import Image from "next/image"
import useWindowSize from '../hooks/useWindowSize'
import Link from 'next/link'
const Casette = ({ casetteState, isScrolled = false }) => {

  const { x, y, rotate, scale, mobileX, mobileY, position, translateX, zIndex, scrollPosition } = casetteState
  const { isMobile } = useWindowSize();
  // const isMobile = true

  const left = isMobile ? mobileX : x;
  const transform = translateX ? `translateX(calc(${left} + ${translateX}))` : `translateX(${left})`;

  return (
    <motion.div
      className={`z-40 h-[300px] fixed p-4 ml-2 transition-all duration-300 `}
      id={'casette'}
      style={{
        scale: scale,
        rotate: rotate,
        top: isMobile ? mobileY : y ,
        // bottom: position !== 'top' ? isMobile? mobileY : y : isMobile ? null : y,
        left: isMobile ? mobileX : x,
        // transform: transform,
        zIndex:zIndex, 

      }}
    >
      <Link href='../'>
      <Image
        src="https://wp.clarksglassworks.com/wp-content/uploads/2023/12/clark-tape.png"
        alt="Clark Tape"
        width={500}
        height={300}
        className={`z-50 cursor-pointer relative animate-float`}
        style={{
          maxWidth: "100%",
          height: "auto"
        }} />
  </Link>
    </motion.div>
  );
}

export default Casette;
