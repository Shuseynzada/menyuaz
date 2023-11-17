import React from "react";
import Carousel from "./Carousel";
import "../css/Home.css";
import { motion } from "framer-motion";
import { services } from "../constans";
import { useState } from "react";
import VerticalList from "./VerticalList";

export default function Home() {
  const [menuChoice, setMenuChoice] = useState("");

  const handleChoice = (e) => {
    if (e.target.innerHTML === menuChoice) setMenuChoice("");
    else setMenuChoice(e.target.innerHTML);
  };

  const pageVariants = {
    initial: { opacity: 0, x: "-100%" },
    animate: { opacity: 1, x: "0%", transition: { duration: 0.3 } },
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
  };

  return (
    <>
      <motion.div
        initial="initial"
        animate="animate"
        variants={pageVariants}
        transition={pageTransition}
        className="bg-white"
      >
        <Carousel />
        <div className="flex flex-col px-4 py-2 justify-center text-center">
          {services?.map((e, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.1 } }}
            >
              <VerticalList key={i} title={e} listData={e} />
            </motion.div>
          ))}
        </div>
        <div className="h-[5vh] bg-black text-yellow-500 px-2">
          KAMPANIYALAR
        </div>
      </motion.div>
    </>
  );
}
