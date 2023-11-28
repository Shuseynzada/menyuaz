import React, { Suspense, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  placeholder,
  instagramlogo,
  wplogo,
  calllogo,
  locationlogo,
  menupng,
  specialpng,
  receptionpng,
  bagpng,
  tiktoklogo,
  woltlogo,
  facebooklogo,
} from "../assets";
import "../css/CartItem.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faUser,
  faCheck,
  faCircleInfo,
} from "@fortawesome/free-solid-svg-icons";
import "animate.css";
import Meals from "./Meals";
import Modal from "react-modal";
import {
  AiOutlineUser,
  AiOutlineHeart,
  AiFillStar,
  AiFillHeart,
  AiFillClockCircle,
} from "react-icons/ai";
import { MdDateRange } from "react-icons/md";
import { HiLocationMarker } from "react-icons/hi";
import { MainContext } from "../context";
import { languageTexts } from "../constans";
import DropdownMenu from "./DropdownMenu";

function removeNonNumericalAndSpaces(inputString) {
  // Check if inputString is a string
  if (typeof inputString !== 'string') {
    return "";
  }

  // Remove all non-numeric characters and spaces
  let tempStr = inputString.replace(/[^0-9]/g, '');
  // Check if the string starts with '0' and has a length of 10
  if (tempStr[0] === '0' && tempStr.length === 10) {
    // Replace the first '0' with '994'
    tempStr = "994" + tempStr.substr(1);
  }

  return tempStr;
}

export default function CartItem({ meals, categories }) {
  const { data } = useContext(MainContext);
  const [result, setResult] = useState({});
  const [value, setValue] = useState("Menu");
  const [modalIsOpen, setIsOpen] = useState(false);
  const [isBasketOpen, setIsBasketOpen] = useState(false);
  const [language, setLanguage] = useState("az")
  const [reservationInfo, setReservationInfo] = useState({
    ad: "",
    qonaq: 1,
    tarix: "",
    saat: "",
    qeyd: "",
  });
  const [reservText, setReservText] = useState("");
  const { id } = useParams();



  useEffect(() => {
    if (result.currency) {
      if (result.currency == "azn") setLanguage("az")
      if (result.currency == "usd" || result.currency == "eur") setLanguage("en")
      if (languageTexts[result.currency]) setLanguage(result.currency)
    }
  }, [result])

  useEffect(() => {
    setReservText(
      `Ad: ${reservationInfo.ad}%0AQonaq sayı: ${reservationInfo.qonaq}%0AGün: ${reservationInfo.tarix}%0ASaat: ${reservationInfo.saat}%0AQeyd: ${reservationInfo.qeyd}%0A`
    );
  }, [reservationInfo]);

  useEffect(() => {
    if (value == "Reservation") document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
  }, [value]);

  const distToDisp = (distance) => {
    if (isNaN(distance)) return "...";
    if (distance > 1) return distance.toFixed(1) + "km";
    else if (distance <= 1) return (distance * 1000).toFixed(1) + "m";
    return distance.toFixed(1);
  };

  useEffect(() => {
    const getItemById = (response, itemId) => {
      const item = response.find((item) => item._id === itemId);
      setResult(item || {});
    };
    getItemById(data, id);
  }, [data, id]);

  function formatHours(startHour, startMin, endHour, endMin) {
    function pad(number) {
      return number < 10 ? "0" + number : number;
    }

    const formattedStartHour = pad(startHour) + ":" + pad(startMin);
    const formattedEndHour = pad(endHour) + ":" + pad(endMin);

    return formattedStartHour + "-" + formattedEndHour;
  }

  const modalStyle = {
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      zIndex: 999,
    },
    content: {
      position: "absolute",
      top: "0",
      left: "0",
      width: "100%",
      height: "100%",
      backgroundColor: "#fff",
    },
  };

  Modal.setAppElement("#root");

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value)
  }


  const wpUseNumber = removeNonNumericalAndSpaces(result.wpNumber)
  return (
    <Suspense>
      <div className="absolute right-[20px]">
        <DropdownMenu language={language} setLanguage={setLanguage} />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.3 } }}
        style={{ backgroundColor: "white", border: "1px solid black" }}
        className=" CartItem bg-white w-full absolute -z-10 left-[0px] flex flex-col items-start opacity-1"
      >
        {(result.canOrder != null ? result.canOrder : true) && (
          <div
            className={`basketDiv ${isBasketOpen ? "open-color bg-yellow-400" : "close-color"}`}
            onClick={() => {if(isBasketOpen) setIsOpen(true)}}
          >
            <img src={bagpng} className="h-[25px] aspect" />
          </div>
        )}
        <div
          style={{
            backgroundImage: `url(${result.banner ? result.banner : placeholder
              })`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
          className="sticky top-[48px] -z-20 bannerPic shadow-cyan-500/50 imageSection"
        ></div>
        <div className="infoPart">
          <div className="absolute bottom-full text-right right-[30px] text-white text-[0.7em] object-contain border-black w-[60%] ">
            <span className="w-full break-words">{result.address}</span>
          </div>
          <div className="UpperPart">
            <div>
              <div className="logoimageborder">
                <div
                  className="logoImage"
                  style={{
                    backgroundImage: `url(${result.profilePic ? result.profilePic : placeholder
                      })`,
                    backgroundSize: "100%",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                  }}
                ></div>
              </div>
            </div>
            <span
              className={
                result.name
                  ? "animate__animated animate__flipInX cartitem-title"
                  : null
              }
            >
              {result.name}
              <span>{result.serviceSector ? result.serviceSector[language]?result.serviceSector[language]:result.serviceSector.az : ""}</span>
            </span>
            <AiOutlineHeart />
          </div>
          <div className="additionalInfo">
            <div>
              <HiLocationMarker style={{ color: "blue" }} />
              <span>{distToDisp(result.dist)}</span>
            </div>
            {!result.isCompany && <><div>
              <AiFillStar style={{ color: "orange" }} />
              <span>5.0</span>
            </div>
              <div>
                <AiFillHeart style={{ color: "red" }} />
                <span>0</span>
              </div></>}
            <div>
              {result.startHour || result.endHour
                ? <><AiFillClockCircle style={{ color: "green" }} />
                  <span>
                    {formatHours(result.startHour, result.startMinute, result.endHour, result.endMinute)}
                  </span>
                </>
                : <></>}
            </div>
          </div>

          <div className="iconList">
            {result.instagramUsername && (
              <a
                href={`https://www.instagram.com/${result.instagramUsername}/`}
                target="_blank"
                className="p-[10px]"
              >
                <img src={instagramlogo} />
              </a>
            )}
            {result.facebookUsername && (
              <a
                href={`https://www.facebook.com/${result.facebookUsername}`}
                target="_blank"
                className="p-[13px]"
              >
                <img src={facebooklogo} />
              </a>
            )}
            {result.wpNumber && result.wpNumber != "" && (
              <a
                href={`https://wa.me/${wpUseNumber}`}
                target="_blank"
                className="p-[10px]"
              >
                <img src={wplogo} />
              </a>
            )}

            {result.phoneNumber && result.phoneNumber != "" && (
              <a
                href={`tel:${(result.phoneNumber[0] != "+") ? "994" : ""}${result.phoneNumber}`}
                target="_blank"
                className="p-[10px]"
              >
                <img src={calllogo} />
              </a>
            )}
            {result.wolt && result.wolt != "" && (
              <a href={result.wolt} target="_blank" className="p-[7px]">
                <img
                  src={woltlogo}
                  style={{
                    filter: "grayscale(1)",
                  }}
                />
              </a>
            )}
            {result.tiktokUsername && result.tiktokUsername != "" && (
              <a
                href={`https://www.tiktok.com/@${result.tiktokUsername}`}
                target="_blank"
                className="p-[10px]"
              >
                <img src={tiktoklogo} />
              </a>
            )}
            {result.latitude && result.latitude != "" && (
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${result.latitude},${result.longitude}`}
                target="_blank"
                className="p-[12px]"
              >
                <img src={locationlogo} />
              </a>
            )}
          </div>
          {!result.isCompany && <div className="OffersPart">
            <div onClick={() => setValue("Menu")}>
              <img
                src={menupng}
                className="icon"
                style={{
                  height: "1.4em",
                  filter: "grayscale(1)",
                }}
              />
              <span>{languageTexts[language].menuOperation}</span>
            </div>
            <div onClick={() => setValue("Order")}>
              <img
                src={specialpng}
                className="icon"
                style={{ height: "1.4em" }}
              />
              <span>{languageTexts[language].menuOperation}</span>
            </div>
            <div onClick={() => setValue("Reservation")}>
              <img
                src={receptionpng}
                className="icon"
                style={{ height: "1.4em" }}
              />
              <span>{languageTexts[language].reservation}</span>
            </div>
          </div>}
          <div className={`DynamicPart ${result.isCompany ? "mt-3" : ""}`}>
            {value === "Menu" ? (
              <Meals
                meals={meals}
                categories={categories}
                setIsOpen={setIsOpen}
                modalIsOpen={modalIsOpen}
                wpnumber={wpUseNumber}
                tableCount={result.tableCount}
                roomCount={result.roomCount}
                serviceFee={result.serviceFeePercentage}
                setIsBasketOpen={setIsBasketOpen}
                canOrder={(result.canOrder != null ? result.canOrder : true)}
                currency={result.currency ? result.currency : "azn"}
                isCompany={result.isCompany}
                language={language}
              />
            ) : (
              <></>
            )}
          </div>
          <Modal
            isOpen={value == "Reservation"}
            onRequestClose={() => {
              setValue("Menu");
            }}
            style={modalStyle}
            contentLabel="Reservation Modal"
            className=""
          >
            <button
              className="absolute left-[10px] top-[10px] w-[3em] text-white bg-black aspect-square border rounded-[50%] z-[1000]"
              onClick={() => {
                setValue("Menu");
              }}
            >
              <FontAwesomeIcon icon={faArrowLeft} />
            </button>
            <div className="flex flex-col items-center">
              <div className="font-bold text-[1.2em] ">{result.name}</div>
              <div className="w-[100%] p-10 flex flex-col gap-3">
                <div>
                  <div className="mb-[0.1em] ml-[1em]">
                    <FontAwesomeIcon icon={faUser} />
                    <span className="m-2 font-semibold">Ad</span>
                  </div>
                  <input
                    type="text"
                    placeholder="Ad"
                    onChange={(e) => {
                      setReservationInfo({
                        ...reservationInfo,
                        ad: e.target.value,
                      });
                    }}
                    className="bg-gray-200 text-black border-black border outline-yellow-300 w-full rounded-[2em] py-[0.7em] px-[1em]"
                  />
                </div>
                <div>
                  <div className="mb-[0.1em] ml-[1em]">
                    <AiOutlineUser size="20" className="inline" />
                    <span className="m-1 font-semibold">Qonaq sayı</span>
                  </div>
                  <input
                    type="number"
                    placeholder="Qonaq sayı"
                    onChange={(e) => {
                      setReservationInfo({
                        ...reservationInfo,
                        qonaq: e.target.value,
                      });
                    }}
                    className="bg-gray-200 text-black border-black border outline-yellow-300 w-full rounded-[2em] py-[0.7em] px-[1em]"
                  />
                </div>
                <div>
                  <div className="mb-[0.1em] ml-[1em]">
                    <MdDateRange size="20" className="inline" />
                    <span className="m-1 font-semibold">Tarix</span>
                  </div>
                  <input
                    type="date"
                    placeholder="Gün"
                    onChange={(e) => {
                      setReservationInfo({
                        ...reservationInfo,
                        tarix: e.target.value,
                      });
                    }}
                    className="bg-gray-200 text-black border-black border outline-yellow-300 w-full rounded-[2em] py-[0.7em] px-[1em] mb-2"
                  />
                  <input
                    type="time"
                    placeholder="Saat"
                    onChange={(e) => {
                      setReservationInfo({
                        ...reservationInfo,
                        saat: e.target.value,
                      });
                    }}
                    className="bg-gray-200 text-black border-black border outline-yellow-300 w-full rounded-[2em] py-[0.7em] px-[1em]"
                  />
                </div>
                <div>
                  <div className="mb-[0.1em] mt-[0.5em] ml-[1em]">
                    <FontAwesomeIcon icon={faCheck} />
                    <span className="m-1 font-semibold">Qeyd</span>
                  </div>
                  <input
                    type="text"
                    placeholder="Qeyd"
                    onChange={(e) => {
                      setReservationInfo({
                        ...reservationInfo,
                        qeyd: e.target.value,
                      });
                    }}
                    className="bg-gray-200 h-[5em] text-black border-black border outline-yellow-300 w-full rounded-[2em] py-[0.7em] px-[1em] mb-2"
                  />
                </div>
                <a
                  className="bg-yellow-300 hover:bg-yellow-400 p-4 rounded-[1em] font-semibold text-center"
                  target="_blank"
                  href={`https://wa.me/${wpUseNumber}?text=${reservText}`}
                >
                  Rezerv Et
                </a>
              </div>
            </div>
          </Modal>
        </div>
        {!result.isCompany && <div className="p-3 flex gap-5 items-center justify-self-start text-[0.9em] font-semibold">
          <FontAwesomeIcon icon={faCircleInfo} className="text-[1.5em]" />
          <span>
            {languageTexts[language].serviceBottom0} {result.serviceFeePercentage}% {languageTexts[language].serviceBottom1}
          </span>
        </div>}
      </motion.div>
    </Suspense>
  )
}