import React, { useState, useRef, useEffect } from "react";
import "../css/Meals.css";
import { faMagnifyingGlass, } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "react-modal";
import ReactDOM from "react-dom";
import { useParams } from "react-router-dom";
import { languageTexts } from "../constans";
import Categories from "./Categories";
import BasketBox from "./BasketBox";

Modal.setAppElement("#root");

export default function Meals({
  meals,
  categories,
  wpnumber,
  modalIsOpen,
  setIsOpen,
  tableCount,
  roomCount,
  serviceFee,
  setIsBasketOpen,
  canOrder,
  currency,
  isCompany,
  language
}) {
  const [isInputVisible, setInputVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mealsByCategory, setMealsByCategory] = useState({});
  const [filteredMeals, setFilteredMeals] = useState([]);
  const [basketItems, setBasketItems] = useState({});
  const [qeyd, setQeyd] = useState("");
  const [allerg, setAllerg] = useState("");
  const [stol, setStol] = useState((isCompany && tableCount) ? 1 : 0);
  const [otaq, setOtaq] = useState((isCompany && tableCount) ? 1 : 0);
  const [wpText, setWpText] = useState("");
  const [total, setTotal] = useState(0);
  const [currOp, setCurrOp] = useState(0);
  const [payMethod, setPayMethod] = useState("cash");
  const [currentItem, setCurrentItem] = useState(NaN);
  const [viewCategory, setViewCategory] = useState("");
  const divRef = useRef(null);
  const inputRef = useRef(null);
  const { id } = useParams();


  function closeModal() {
    setCurrOp(0);
    setIsOpen(false);
  }

  const scrolltoId = (id) => {
    var access = document.getElementById(id);
    if (!access) return
    window.scrollBy({
      left: access.getBoundingClientRect().x,
      top: access.getBoundingClientRect().y - 60,
      behavior: "smooth"
    });
  };


  useEffect(() => {
    const newFilteredMeals = meals.filter((meal) =>
      meal.name[language] ? meal.name[language].toLowerCase().includes(searchQuery.toLowerCase()) : meal.name.az.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredMeals(newFilteredMeals);
  }, [searchQuery, meals]);

  const toggleInputVisibility = () => {
    setInputVisible(!isInputVisible);
  };

  const handleClickOutside = (event) => {
    if (
      divRef.current &&
      !divRef.current.contains(event.target) &&
      event.target !== inputRef.current
    ) {
      setInputVisible(false);
    }
  };

  useEffect(() => {
    const localPath = window.localStorage.getItem("Path");
    if (localPath != null) {
      if (localPath != id) window.localStorage.clear();
    } else window.localStorage.setItem("Path", id);

    const localBasket = window.localStorage.getItem("Basket");
    const localQeyd = window.localStorage.getItem("Qeyd");
    const localAllerg = window.localStorage.getItem("Allergiya");
    const localStol = window.localStorage.getItem("Stol");
    const localOtaq = window.localStorage.getItem("Otaq");
    const localPayMethod = window.localStorage.getItem("PayMethod");
    if (localBasket != null) {
      setBasketItems(JSON.parse(localBasket));
    }
    if (localStol != null) setStol(localStol);
    if (localOtaq != null) setOtaq(localOtaq);
    if (localAllerg != null) setAllerg(localAllerg);
    if (localPayMethod != null) setPayMethod(localPayMethod);
    if (localQeyd != null) setQeyd(localQeyd);

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    window.localStorage.setItem("Basket", JSON.stringify(basketItems));
  }, [basketItems]);

  useEffect(() => {
    window.localStorage.setItem("Qeyd", qeyd);
  }, [qeyd]);

  useEffect(() => {
    window.localStorage.setItem("Stol", stol);
  }, [stol]);
  useEffect(() => {
    window.localStorage.setItem("Otaq", otaq);
  }, [otaq]);

  useEffect(() => {
    window.localStorage.setItem("Allergiya", allerg);
  }, [allerg]);

  useEffect(() => {
    window.localStorage.setItem("PayMethod", payMethod);
  }, [payMethod]);

  useEffect(() => {
    const mappedMeals = filteredMeals.reduce((acc, meal) => {
      const categoryId = meal.categoryId;
      acc[categoryId] = acc[categoryId] ? [...acc[categoryId], meal] : [meal];
      return acc;
    }, {});
    setMealsByCategory(mappedMeals);
  }, [filteredMeals]);

  const handleCountChange = (mealId, count) => {
    if (count === 0) {
      removeMealFromBasket(mealId);
    } else {
      setBasketItems((prevBasket) => ({
        ...prevBasket,
        [mealId]: Math.max(count, 0),
      }));
    }
  };

  const getMealCountInBasket = (mealId) => {
    return basketItems[mealId] ? basketItems[mealId] : 0;
  };

  const calculateTotalPricePerMeal = (mealId) => {
    const count = getMealCountInBasket(mealId);
    const meal = meals.find((m) => m._id === mealId);
    if (meal) {
      return meal.price * count;
    }
    return 0;
  };

  const calculateTotalPrice = () => {
    let total = 0;
    Object.keys(basketItems).forEach((mealId) => {
      total += calculateTotalPricePerMeal(mealId);
    });
    return total;
  };

  const removeMealFromBasket = (mealId) => {
    setBasketItems((prevBasket) => {
      const newBasket = { ...prevBasket };
      delete newBasket[mealId];
      return newBasket;
    });
  };

  useEffect(() => {
    const arr = Object.keys(basketItems).map((mealId) => {
      const meal = meals.find((m) => m._id === mealId);
      let txt = "";
      if (meal)
        txt = `${meal.name[language] ? meal.name[language] : meal.name.az}: ${getMealCountInBasket(
          mealId
        )} (x${meal.price.toFixed(1)}${(currency == "azn") ? "₼" : ((currency == "usd") ? "$" : (currency == "eur") ? "€" : (currency != null && currency != "") ? currency : "₼")})`;
      return txt;
    });

    const serviceTotal = (serviceFee * calculateTotalPrice()) / 100;
    setTotal(calculateTotalPrice() + serviceTotal);
    setWpText(
      `${arr.join("%0A")}
      ${(stol != null && stol != 0) ? `%0A${languageTexts[language].table}: ${stol}` : ""}
      ${(otaq != null && otaq != 0) ? `%0A${languageTexts[language].room}: ${otaq}` : ""}
      ${allerg ? `%0A${languageTexts[language].allerg}: ${allerg}` : ""}
      ${qeyd ? `%0A${languageTexts[language].note}: ${qeyd}` : ""}
      ${serviceFee != 0 ? `%0A${languageTexts[language].servicefee}: ${serviceFee}%` : ""}
      %0A${languageTexts[language].billSum}: ${(calculateTotalPrice() + serviceTotal).toFixed(1)}${(currency == "azn") ? "₼" : ((currency == "usd") ? "$" : (currency == "eur") ? "€" : (currency != null && currency != "") ? currency : "₼")}`
    );
  }, [basketItems, qeyd, stol, allerg, otaq]);

  const mealsUpperRef = useRef(null);

  const handleHorizontalScrollById = (id) => {
    const element = document.getElementById(id);
    if (element && mealsUpperRef.current) {
      const container = mealsUpperRef.current;
  
      const elementLeft = element.offsetLeft;
      const elementWidth = element.clientWidth;
      const containerWidth = container.clientWidth;
  
      // Calculate centers
      const elementCenter = elementLeft + (elementWidth / 2);
      const containerCenter = containerWidth / 2;
  
      // Calculate the scroll distance
      const scrollLeft = elementCenter - containerCenter;
  
      container.scroll({
        left: scrollLeft,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    handleHorizontalScrollById(`cat${viewCategory}`)
  }, [viewCategory])

  return (
    <div className={`Meals `} id="Meals">
      {ReactDOM.createPortal(
        <BasketBox
          isCompany={isCompany}
          setIsBasketOpen={setIsBasketOpen}
          modalIsOpen={modalIsOpen}
          setCurrOp={setCurrOp}
          currOp={currOp}
          serviceFee={serviceFee}
          closeModal={closeModal}
          basketItems={basketItems}
          meals={meals}
          handleCountChange={handleCountChange}
          getMealCountInBasket={getMealCountInBasket}
          setQeyd={setQeyd}
          setAllerg={setAllerg}
          setStol={setStol}
          setOtaq={setOtaq}
          calculateTotalPricePerMeal={calculateTotalPricePerMeal}
          setBasketItems={setBasketItems}
          tableCount={tableCount}
          roomCount={roomCount}
          total={total}
          wpText={wpText}
          wpnumber={wpnumber}
          payMethod={payMethod}
          setPayMethod={setPayMethod}
          removeMealFromBasket={removeMealFromBasket}
          currentItem={currentItem}
          qeyd={qeyd}
          stol={stol}
          otaq={otaq}
          allerg={allerg}
          currency={currency}
          language={language}
          setIsOpen={setIsOpen}
        />,
        document.getElementById("modal")
      )}
      <div className="MealsUpper" id="MealsUpper" ref={mealsUpperRef}>
        <div className="SearchPart">
          <div
            className={`SearchIcon ${isInputVisible ? "SearchBorder" : null}`}
            ref={divRef}
            onClick={toggleInputVisibility}
          >
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              style={{ color: "#eab208", height: "2em" }}
            />
          </div>
          {isInputVisible && (
            <input
              className="animate__animated animate__slideInLeft"
              ref={inputRef}
              type="search"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
              }}
              placeholder={`${languageTexts[language].searchPlace}...`}
              onClick={(e) => e.stopPropagation()}
            />
          )}
        </div>
        {categories.map((e, i) => {
          return (
            <div
              id={`cat${e.name.az}`}
              key={e._id}
              className={`categoryItems  ${viewCategory == e.name.az ? "bg-yellow-400" : ""
                }`}
              onClick={() => {
                scrolltoId(`cat${e._id}`);
                setTimeout(() => {
                  setViewCategory(e.name.az);
                }, 100);
              }}
            >
              {e.name[language] ? e.name[language].charAt(0).toUpperCase() + e.name[language].substr(1) : e.name.az.charAt(0).toUpperCase() + e.name.az.substr(1)}
            </div>
          );
        })}
      </div>
      {categories.map((event, i) => {
        const categoryMeals = mealsByCategory[event._id];
        if (categoryMeals && categoryMeals.length > 0) {
          return (
            <Categories
              language={language}
              isCompany={isCompany}
              key={event._id}
              handleCountChange={handleCountChange}
              event={event}
              getMealCountInBasket={getMealCountInBasket}
              categoryMeals={categoryMeals}
              setViewCategory={setViewCategory}
              setIsOpen={setIsOpen}
              setCurrOp={setCurrOp}
              setCurrentItem={setCurrentItem}
              index={i}
              isSet={
                (event.name[language] ? event.name[language].includes("Set") : event.name.az.includes("Set")) ||
                (event.name[language] ? event.name[language].includes("set") : event.name.az.includes("set"))
              }
              canOrder={canOrder}
              currency={currency}
              scrolltoId={scrolltoId}
            />
          );
        }
        return null;
      })}
    </div>
  );
}
