import React from "react";
import "../css/Carousel.css";
import useFireStore from "../hooks/useFireStore"

export default function Carousel() {

  const carousel = useFireStore("carousel")
  

  return (
    <div className="carousel-container">
      {carousel && carousel.map((e, i) => {
        return (
          <div key={i} className="carousel-item">
            <img src={e.url} className="w-full h-full object-cover " />
          </div>
        );
      })}
    </div>
  );
}
