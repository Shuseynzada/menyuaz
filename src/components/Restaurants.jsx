import React, { useContext, useEffect, useState } from "react";
import "../css/Restaurants.css";
import { MainContext } from "../context";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { NavLink, useLocation } from "react-router-dom";
import { placeholder } from "../assets";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faListCheck,
  faLocationArrow,
  faLocationDot,
  faLocationPin,
  faMagnifyingGlass,
  faPhone,
  faUtensils,
} from "@fortawesome/free-solid-svg-icons";
import { BiGridAlt } from "react-icons/bi";
import { MdTableRows } from "react-icons/md";
import { FaStore } from "react-icons/fa";
import Navbar from "./Navbar";
import { categories } from "../constans";

export default function Restaurants() {
  const location = useLocation().pathname;
  const { data } = useContext(MainContext);
  const [searchText, setSearchText] = useState("");
  const [queriedData, setQueriedData] = useState([]);
  const [currCategory, setCurrCategory] = useState("Ailəvi restoran")
  


  let anyCategoryElement = false
  const categoryMap = data.map((e, i) => {
    if (currCategory == e.serviceSector.az) {
      anyCategoryElement = true
      return (
        e.isActive && <NavLink to={`/restaurants/${e._id}`} key={`category${i}`} className="h-full grow-0 overflow-y-visible shadow-black">
          <Cards title={e.name} picture={e.profilePic ? e.profilePic : placeholder} dist={e.dist} />
        </NavLink>)
    }
  })

  useEffect(() => {
    const queryData = data.filter((da) =>
      da.name.toLowerCase().includes(searchText.toLowerCase())
    );
    setQueriedData(queryData);
  }, [searchText, data]);

  const [arrange, setArrange] = useState(0);

  return (
    <>
      <div className="pt-[5em] min-h-[100vh] bg-white flex flex-col items-center">
        <div className="h-[10vh] w-[80%] px-5 flex items-center mb-2 border-4 border-black">
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className="text-black text-[1.5em]"
          />
          <input
            className="w-full p-1 sm:text-[1.1em] outline-none resize-none whitespace-nowrap"
            placeholder="Restoran axtarın"
            onChange={(e) => {
              setSearchText(e.target.value);
            }}
          />
        </div>
        { !searchText &&
          <div className="restaurants p-5 card-perspective w-full">
            <div className="flex justify-between items-center">
              <div className="text-[1.5em] flex items-center gap-4">
                <FontAwesomeIcon icon={faUtensils} />
                <span className="font-bold">Yaxınlıqdakı restoranlar</span>
              </div>
            </div>
            <div className="restaurants flex  overflow-x-scroll gap-10 mt-2 p-[1em]">
              {
                data.slice(0, 10).map((e, i) => (
                  e.isActive && <NavLink to={`/restaurants/${e._id}`} key={`card${i}`} className="h-full overflow-y-visible shadow-black">
                    <Cards title={e.name} picture={e.profilePic ? e.profilePic : placeholder} dist={e.dist} />
                  </NavLink>
                ))
              }
            </div>
            <div className="flex justify-between items-center">
              <div className="text-[1.5em] flex items-center gap-4">
                <FontAwesomeIcon icon={faListCheck} />
                <span className="font-bold">Keteqoriyalar</span>
              </div>
            </div>
            <div className="restaurants flex overflow-x-scroll gap-2 text-[1rem] mt-2 pb-2">
              {
                categories.map((e, i) => (
                  <div key={`category-card${i}`} className={`hover:cursor-pointer category-card bg-black whitespace-nowrap text-white py-1 px-2 rounded-lg items-center ${(currCategory == e) ? "bg-yellow-500" : ""} `} onClick={() => setCurrCategory(e)}>
                    {e}
                  </div>
                ))
              }
            </div>
            <div className="restaurants flex gap-10 overflow-x-scroll mt-2 p-[1em]">
              {
                (!anyCategoryElement) ?
                  <Cards title={"Tezliklə"} picture={placeholder} dist={0} />
                  : categoryMap
              }
            </div>
          </div>
        }
        {
          <div className="w-[90%] h-1 bg-black sm:block hidden mt-[1em]">
            <div className="flex h-[1.5em] w-[3em] items-center justify-center text-[1.5em] line-round rounded-lg border-black border-2 bg-white overflow-hidden">
              <div
                className={`hover:cursor-pointer select-none flex justify-center items-center w-full h-full ${arrange == 0 ? "bg-yellow-500" : ""
                  }`}
                onClick={() => {
                  setArrange(0);
                }}
              >
                <BiGridAlt />
              </div>
              <div className="w-[2px] bg-black h-full"></div>

              <div
                className={`hover:cursor-pointer select-none flex justify-center items-center w-full h-full ${arrange == 1 ? "bg-yellow-500" : ""
                  }`}
                onClick={() => {
                  setArrange(1);
                }}
              >
                <MdTableRows />
              </div>
            </div>
          </div>
        }
        <div
          className={`grid whitespace-nowrap grid-cols-1 ${arrange == 0 ? "md:grid-cols-3 sm:grid-cols-2" : ""
            } w-[80%] gap-5 m-10`}
        >
          {queriedData.map((e, i) => (
            e.isActive && <NavLink
              key={`allres-card${i}`}
              to={`${location}/${e._id}`}
              className=""
            >
              <Card
                title={e.name}
                picture={e.profilePic == "" ? placeholder : e.profilePic}
                distance={e.dist}
                arrange={arrange}
                phone={e.phoneNumber}
                address={e.address}
                service={e.serviceSector.az}
              />
            </NavLink>
          ))}
        </div>
      </div>
    </>
  );
}

function Card({ title, picture, distance, arrange, phone, address, service }) {
  const { ref, inView } = useInView();

  const animation = useAnimation();

  useEffect(() => {
    if (inView) {
      animation.start({
        x: 0,
        transition: {
          type: "spring",
          duration: 1,
          bounce: 0.3,
        },
      });
    }
    if (!inView) {
      animation.start({ x: "-10vw" });
    }
  }, [inView]);

  const distToDisp = () => {
    if (isNaN(distance)) return "...";
    if (distance > 1) return distance.toFixed(1) + "km";
    else if (distance <= 1) return (distance * 1000).toFixed(1) + "m";
    return distance.toFixed(1);
  };

  return (
    <motion.div
      ref={ref}
      animate={animation}
      className={`min-h-[20vh] hover:outline box-shadow overflow-hidden sm:${arrange == 0 ? "" : "flex"
        }`}
    >
      <div
        style={{ backgroundImage: "url(" + picture + ")" }}
        className={`${arrange == 0 ? "" : "sm:w-[20vw]"} overflow-hidden aspect-square bg-cover bg-center`}
      ></div>
      <div className="w-full p-3">
        <div
          className={`w-full  ${arrange == 1 ? "p-6 flex justify-between items-center" : ""
            }`}
        >
          <div className="font-bold sm:text-[1.2em]">{title}</div>
          <div className="">
            <div className="flex gap-1 items-center font-semibold">
              {distToDisp()}
              <FontAwesomeIcon icon={faLocationDot} />
            </div>
          </div>
        </div>
        <div className={`flex-col hidden sm:${arrange == 0 ? "" : "flex"}`}>
          <div className="flex gap-2 items-center font-semibold">
            <FontAwesomeIcon icon={faPhone} />
            <div>{phone}</div>
          </div>
          <div className="flex gap-2 items-center font-semibold">
            <FontAwesomeIcon icon={faLocationArrow} />
            <div>{address}</div>
          </div>
          <div className="flex gap-2 items-center font-semibold">
            <FaStore />
            <div>{service}</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function Cards({ title, picture, dist }) {

  const distToDisp = () => {
    if (isNaN(dist)) return "...";
    if (dist > 1) return dist.toFixed(1) + "km";
    else if (dist <= 1) return (dist * 1000).toFixed(1) + "m";
    return dist.toFixed(1);
  }

  return (
    <div className="hover:translate-y-[-1em] transition">
      <motion.div initial={{ transform: "rotateX(-90deg)" }} animate={{ transform: "rotateX(0)" }} exit={{ transform: "rotateX(90deg)" }} className="w-[12em] h-[13em] origin-bottom rounded-[1em] res-shadow transition">
        <div style={{ backgroundImage: "url(" + picture + ")" }} className="w-full bg-cover bg-center bg-no-repeat h-[60%] rounded-[1em] rounded-[1em] rounded-bl-[0]"></div>
        <div className="p-3 flex flex-col pb-5 justify-between h-[6em]">
          <div className="text-[0.9em] font-semibold">{title}</div>
          {(title != "Tezliklə") ? <div className="flex gap-1 items-center">
            <FontAwesomeIcon icon={faLocationPin} />
            {distToDisp()}
          </div> : <></>}
        </div>
      </motion.div>
    </div>
  )
}
