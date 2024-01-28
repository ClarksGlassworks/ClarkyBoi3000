import { motion, useAnimation, useScroll } from "framer-motion";
import Image from "next/legacy/image";
import { useEffect, useRef, useState } from "react";
import useWindowSize from "../hooks/useWindowSize";
import { start } from "repl";
import { useScrollPosition } from "../lib/api";
const ClarkyBoi = ({ clarkyBoiState, key, scrollPosition }) => {
    const controls = useAnimation();
    const { scrollY, scrollYProgress } = useScroll();
    const { isMobile } = useWindowSize();
    const containerHeight = scrollY.get();
    const [scrollState, setScrollState] = useState("initial"); // 'initial' | 'scrolling' | 'end'
    const ref = useRef(null); // Define the ref variable
    const scrollYPercent = (scrollYProgress.get() * 100);
    // const scrollPosition = useScrollPosition();
    let startState = {
        
        x: isMobile ? `100%`: `70%`,
        opacity: 1,
        y: isMobile ? "100%": '20%',
        scale:1
    };
    const endState = {
        x: `35%`,
        y: "5%",
        opacity:1,
        scale:1
    };

    let finalState = {
        
        x: isMobile ? `0%`: `70%`,
        opacity: 1,
        scale:0.8,
        y: isMobile ? "20%": '20%',
    };

    let finalState2 = {
        
        x: isMobile ? `0%`: `70%`,
        opacity: 1,
        scale:0.7,
        y: isMobile ? "55%": '20%',
    };
    const slideInTransition = {
        type: "tween",
        duration: 0.5,
    };

    useEffect(()=>{
        console.log('Clarky', scrollPosition)
        if(scrollPosition === "scrolling2"){
            controls.start(finalState)
        } else if(scrollPosition === "initial"){
            controls.start(startState)
        } else if(scrollPosition === "end"){ 
            controls.start(endState)
        } else if(scrollPosition === "scrolling3"){ 
            controls.start(finalState2)
        }
    },[scrollPosition])
    
    return (
        <motion.div
            ref={ref}
            key={key}
            initial={startState}
            animate={controls}
            transition={slideInTransition}
            className="overflow-hidden absolute z-50 bottom-0 right-0"
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
