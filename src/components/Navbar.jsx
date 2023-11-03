import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faPeopleGroup,
  faAddressBook,
  faHandshake,
  faUtensils,
} from "@fortawesome/free-solid-svg-icons";
import { NavLink, useLocation } from "react-router-dom";
import { useState } from "react";
import "../css/Navbar.css";
import { motion } from "framer-motion";
import { menyuazlogo } from "../assets";
export default function Navbar() {
  const [isMenu, setIsMenu] = useState(false);

  const handleMenuClick = () => {
    setIsMenu(!isMenu);
  };

  let location = useLocation().pathname;

  return (
    <motion.div
      initial={{ transform: "translateY(-100%)" }}
      animate={{ transform: "translateY(0)" }}
      exit={{ transform: "translateY(-100%)" }}
      className="sm:px-[6rem] xl:px-[12rem] min-w-full h-[3em] bg-yellow-500 flex justify-between left-[0] fixed text-[1em] z-[30]"
    >
      <NavLink to="./" className="h-full aspect-square">
        <img src={menyuazlogo} className="w-full h-full p-1" />
      </NavLink>
      <div className="hidden sm:flex items-center">
        <NavLink
          to="/"
          className={`h-full flex items-center px-[1rem] hover:bg-yellow-400 ${
            location == "/" ? "bg-yellow-600" : ""
          }`}
        >
          <FontAwesomeIcon icon={faHouse} />
          <label className="font-bold p-1 hidden lg:inline">Ana Səhifə</label>
        </NavLink>
        <div className="w-[1px] h-[50%] bg-black"></div>
        <NavLink
          to="/about"
          className={`h-full flex items-center px-[1rem] hover:bg-yellow-400 ${
            location == "/about" ? "bg-yellow-600" : ""
          }`}
        >
          <FontAwesomeIcon icon={faPeopleGroup} />
          <label className="font-bold p-1 hidden lg:inline">Haqqımızda</label>
        </NavLink>
        <div className="w-[1px] h-[50%] bg-black"></div>
        <NavLink
          to="/restaurants"
          className={`h-full flex items-center px-[1rem] hover:bg-yellow-400 ${
            location == "/services" ? "bg-yellow-600" : ""
          }`}
        >
          <FontAwesomeIcon icon={faUtensils} />
          <label className="font-bold p-1 hidden lg:inline">Restoranlar</label>
        </NavLink>
        <div className="w-[1px] h-[50%] bg-black"></div>
        <NavLink
          to="/partners"
          className={`h-full flex items-center px-[1rem] hover:bg-yellow-400 ${
            location == "/partners" ? "bg-yellow-600" : ""
          }`}
        >
          <FontAwesomeIcon icon={faHandshake} />
          <label className="font-bold p-1 hidden lg:inline">Partnyorlar</label>
        </NavLink>
        <div className="w-[1px] h-[50%] bg-black"></div>
        <NavLink
          to="/contact"
          className={`h-full flex items-center px-[1rem] hover:bg-yellow-400 ${
            location == "/contact" ? "bg-yellow-600" : ""
          }`}
        >
          <FontAwesomeIcon icon={faAddressBook} />
          <label className="font-bold p-1 hidden lg:inline">Əlaqə</label>
        </NavLink>
      </div>
      <div
        className="flex sm:hidden items-center px-[1rem] hover:bg-yellow-400 z-[40]"
        onClick={handleMenuClick}
      >
        <div className="relative flex flex-col justify-center items-center gap-[4px] bars inline w-[1.5em] ">
          <div
            className={`line w-full h-[4px] rounded bg-black transition duration-[200ms] ${
              isMenu ? "rotate-[45deg] absolute" : ""
            }`}
          ></div>
          <div
            className={`line w-full h-[4px] rounded bg-black  duration-[200ms] ${
              isMenu ? "hidden absolute" : ""
            }`}
          ></div>
          <div
            className={`line w-full h-[4px] rounded bg-black transition duration-[200ms] ${
              isMenu ? "rotate-[-45deg] absolute" : ""
            }`}
          ></div>
        </div>
        <div
          className={`absolute w-[50%] ${
            !isMenu ? "active-div" : "non-active-div"
          } flex flex-col text-center justify-center bg-[gray] top-[3em] right-[0] rounded-bl-[1em] overflow-hidden text-[1em] `}
        >
          <NavLink
            to="/"
            style={{ "--i": 5 }}
            className={`w-full navlink menuclick active:bg-yellow-500 p-4 ${
              location == "/" ? "bg-yellow-600" : ""
            } `}
          >
            <FontAwesomeIcon icon={faHouse} />
            <label className="font-bold p-2">Ana Səhifə</label>
          </NavLink>
          <NavLink
            to="/about"
            style={{ "--i": 4 }}
            className={`w-full  navlink menuclick active:bg-yellow-500 p-4 ${
              location == "/about" ? "bg-yellow-600" : ""
            }`}
          >
            <FontAwesomeIcon icon={faPeopleGroup} />
            <label className="font-bold p-2">Haqqımızda</label>
          </NavLink>
          <NavLink
            to="/restaurants"
            style={{ "--i": 3 }}
            className={`w-full  navlink menuclick active:bg-yellow-500 p-4 ${
              location == "/services" ? "bg-yellow-600" : ""
            }`}
          >
            <FontAwesomeIcon icon={faUtensils} />
            <label className="font-bold p-2">Restoranlar</label>
          </NavLink>
          <NavLink
            style={{ "--i": 2 }}
            to="/partners"
            className={`w-full navlink menuclick active:bg-yellow-500 p-4 ${
              location == "/partners" ? "bg-yellow-600" : ""
            }`}
          >
            <FontAwesomeIcon icon={faHandshake} />
            <label className="font-bold p-2">Partnyorlar</label>
          </NavLink>
          <NavLink
            style={{ "--i": 1 }}
            to="/contact"
            className={`w-full navlink menuclick active:bg-yellow-500 p-4 ${
              location == "/contact" ? "bg-yellow-600" : ""
            }`}
          >
            <FontAwesomeIcon icon={faAddressBook} />
            <label className="font-bold p-2">Əlaqə</label>
          </NavLink>
        </div>
      </div>
    </motion.div>
  );
}
