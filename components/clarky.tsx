import { motion, useAnimation, useScroll } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import useWindowSize from "../hooks/useWindowSize";
const ClarkyBoi = ({ clarkyBoiState }) => {
    const controls = useAnimation();
    const { scrollY, scrollYProgress } = useScroll();
    const { isMobile } = useWindowSize();
    const containerHeight = scrollY.get();
    const [scrollState, setScrollState] = useState("initial"); // 'initial' | 'scrolling' | 'end'
    const ref = useRef(null); // Define the ref variable
    const scrollYPercent = (scrollYProgress.get() * 100);
    let startState = {
        
        x: isMobile ? `70%`: `70%`,
        opacity: 0,
        y: isMobile ? "40%": '40%',
    };
    const endState = {
        x: `35%`,
        y: "5%",
        opacity:1,
    };
    const slideInTransition = {
        type: "tween",
        duration: 0.5,
    };

    useEffect(()=>{
        console.log(scrollState)
        if(scrollState === "scrolling"){
            controls.start(endState)
        } else if(scrollState === "initial"){
            controls.start(startState)
        } else if(scrollState === "end"){ 
            controls.start(endState)
        }
    },[scrollState])
    useEffect(() => {
        const handleScroll = () => {
          const totalHeight = document.body.scrollHeight - window.innerHeight;
          const scrollPosition = window.scrollY;
      
          if (scrollPosition < 400) {
            setScrollState("initial");
          } else if (scrollPosition > 400 && scrollPosition < totalHeight) {
            setScrollState("scrolling");
          } else if (scrollPosition >= totalHeight) {
            setScrollState("end");
          }
        };
      
        window.addEventListener("scroll", handleScroll);
      
        return () => {
          window.removeEventListener("scroll", handleScroll);
        };
      }, []);
    return (
        <motion.div
            ref={ref}
            initial={startState}
            animate={controls}
            transition={slideInTransition}
            className="overflow-hidden fixed z-50 bottom-0 right-0"
        >
            <div className="relative">
                <Image
                    src="https://wp.clarksglassworks.com/wp-content/uploads/2024/01/shadow.png"
                    width="600"
                    height="300"
                    alt="ClarkyBoi"
                    className={`absolute top-5 right-20 z-0 blur-sm opacity-80 `} // Updated class with lower z-index
                />
                <Image
                    src="https://wp.clarksglassworks.com/wp-content/uploads/2024/01/clark-transparent-not-simps.png"
                    width="600"
                    height="300"
                    alt="ClarkyBoi"
                    className={`z-10 relative`}
                />
             
            </div>
        </motion.div>
    );
};

export default ClarkyBoi;
