import React from "react";
import Carousel from "./Carousel";
import "../css/Home.css";
import { motion } from "framer-motion";
import { services } from "../constans";
import { menyuazlogo } from "../assets";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import { CSSTransition } from "react-transition-group";
export default function Home() {

  const [menuChoice, setMenuChoice] = useState("")

  const handleChoice = (e) => {
    if (e.target.innerHTML == menuChoice) setMenuChoice("")
    else setMenuChoice(e.target.innerHTML)
  }
  return (
    <>
      <motion.div
        initial={{ transform: "translate(-100%)" }}
        animate={{ transform: "translate(0%)", transition: { duration: 0.3 } }}
        className="bg-white"
      >
        <Carousel />
        <div className="flex flex-col px-3 py-2 gap-[10px]">
          {services.map((e, i) => {
            return (<div key={"mainserv" + i} to="/about" className="text-center font-bold bg-yellow-500">
              <div className="py-1" onClick={handleChoice} >{e.title}</div>
              <CSSTransition in={menuChoice == e.title && e.choices.length > 1} unmountOnExit timeout={500} classNames="menu-primary">
                <div className="flex flex-col gap-[5px] px-5 py-2">
                  {e.choices.map((ev, index) => {
                    return <div key={e.title + "choice" + index} className="item-button bg-black text-yellow-500 p-2">{ev.title}</div>
                  })}
                </div>
              </CSSTransition>
            </div>)
          })}
        </div>
        <div className="h-[5vh] bg-black text-yellow-500 px-2">
          KAMPANIYALAR
        </div>
      </motion.div>
    </>
  );
}
