import Image from "next/image";
import ShoppingCartButton from "./shoppingCartButton";

import { motion } from "framer-motion";


    const Corner = ({ scrollState }) => {
      const variants = {
        hidden: { opacity: 1 },
        visible: { opacity: 0 },
      };

      return (
        <motion.div
          className="fixed top-0 right-0"
          initial="hidden"
          animate={scrollState === "scrolling" ? "visible" : "hidden"}
          variants={variants}
        >
          <Image
            src="https://wp.clarksglassworks.com/wp-content/uploads/2023/12/corner-leopard.png"
            alt="Corner Leopard"
            width={500}
            height={300}
            className="z-20"
          />
          <ShoppingCartButton />
        </motion.div>
      );
    };

    export default Corner;
