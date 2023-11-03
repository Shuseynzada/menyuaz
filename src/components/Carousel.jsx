import React from "react";
import { carousel } from "../constans";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretLeft, faCaretRight } from "@fortawesome/free-solid-svg-icons";
import { placeholder } from "../assets";
import "../css/Carousel.css";

export default function Carousel() {
  return (
      <div className="carousel-container">
        {carousel.map((e, i) => {
          return (
            <div key={i} className="carousel-item">
              <img src={e.bg} className="w-full h-full object-cover" />
            </div>
          );
        })}
    </div>
  );
}
