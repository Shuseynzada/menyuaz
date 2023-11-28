import React, { useState, useRef, useEffect } from "react";
import "../css/Meals.css";
import { faMagnifyingGlass, } from "@fortawesome/free-solid-svg-icons";
import { faCircleXmark } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { placeholder } from "../assets";
import Modal from "react-modal";
import { BiPlusCircle, BiMinusCircle } from "react-icons/bi";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useInView } from "react-intersection-observer";
import ReactDOM from "react-dom";
import { useParams } from "react-router-dom";
import { languageTexts } from "../constans";


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
    window.scrollBy(
      access.getBoundingClientRect().x,
      access.getBoundingClientRect().y - 70
    );
  };


  useEffect(() => {
    const newFilteredMeals = meals.filter((meal) =>
    meal.name[language]?meal.name[language].toLowerCase().includes(searchQuery.toLowerCase()):meal.name.az.toLowerCase().includes(searchQuery.toLowerCase())
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

  const upperScroll = useRef()

  const handleScroll = () => {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = Math.max(
      document.body.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.clientHeight,
      document.documentElement.scrollHeight,
      document.documentElement.offsetHeight
    );

    // Calculate the scroll percentage
    const percentage = (scrollTop / (documentHeight - windowHeight));

    // Calculate the scroll position for the horizontal fixed line
    const containerWidth = upperScroll.current.clientWidth;
    const scrollPosition = containerWidth * percentage;
    // Set the sconstcroll position for the horizontal fixed line
    upperScroll.current.scrollLeft = scrollPosition
  };


  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

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
      <div className="MealsUpper" id="MealsUpper" ref={upperScroll}>
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
              key={e._id}
              className={`categoryItems  ${viewCategory == e.name[language] ? "bg-yellow-400" : ""
                }`}
              onClick={() => {
                scrolltoId(`cat${e._id}`);
                setTimeout(() => {
                  setViewCategory(e.name[language]);
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
            />
          );
        }
        return null;
      })}
    </div>
  );
}

function Categories({
  index,
  handleCountChange,
  getMealCountInBasket,
  event,
  categoryMeals,
  setViewCategory,
  setIsOpen,
  setCurrentItem,
  setCurrOp,
  isSet,
  canOrder,
  currency,
  isCompany,
  language
}) {
  const [ref, inView] = useInView({
    threshold: 0.2,
  });

  useEffect(() => {
    if (inView) {
      setViewCategory(event.name[language] ? event.name[language] : event.name.az);
    }
  }, [inView]);

  return (
    <>
      <div
        ref={ref}
        key={event._id}
        id={`cat${event._id}`}
        className={`categoryParent ${index == 0 ? "pt-[1.2em]" : ""}`}
      >
        <span className="categoryName" id={`categoryname${event._id}`}>
          {event.name[language] ? event.name[language].charAt(0).toUpperCase() + event.name[language].substr(1) : event.name.az.charAt(0).toUpperCase() + event.name.az.substr(1)}
        </span>
        {categoryMeals.map((e) => {
          if (e.isActive)
            return (
              <div
                className={`MealsItem ${isCompany ? "h-[150px]" : (isSet ? "h-[200px]" : "h-[90px]")}`}
                key={e._id}
              >
                <div
                  className={`ItemImage ${isSet ? "w-[40%] h-full " : "h-full"
                    } bg-cover  bg-center`}
                  onClick={() => {
                    setIsOpen(true);
                    setCurrOp(2);
                    setCurrentItem(e);
                  }}
                  style={{
                    backgroundImage: `url(${e.pics.length !== 0 ? e.pics : placeholder
                      })`,
                  }}
                ></div>
                <div
                  className={`${isCompany ? " companyTextPart" : isSet ? "setliText" : "textPart"} font-bold py-3`}
                >
                  <span className={`${isSet ? "" : "text-[0.8em]"} ${isSet ? "setliTextSpan" : "textPartSpan"}`}>
                    {" "}
                    {e.name[language] ? e.name[language].charAt(0).toUpperCase() + e.name[language].substr(1) : e.name.az.charAt(0).toUpperCase() + e.name.az.substr(1)}
                  </span>
                  <span className={`text-[0.6em] font-normal ${isSet ? "setliTextSpan" : "textPartSpan"} fourline`}>
                    {e.ingredients ? e.ingredients[language] ? e.ingredients[language] : e.ingredients.az : ""}
                  </span>
                  <span>
                    {`${e.price} `} {(currency == "azn") ? "₼" : ((currency == "usd") ? "$" : (currency == "eur") ? "€" : (currency != null && currency != "") ? currency : "₼")}
                  </span>
                </div>
                {canOrder && <div className="countContainer absolutetoRight">
                  <button
                    onClick={() =>
                      handleCountChange(e._id, getMealCountInBasket(e._id) - 1)
                    }
                  >
                    <BiMinusCircle
                      style={
                        getMealCountInBasket(e._id) === 0
                          ? { fill: "rgb(176 176 176)" }
                          : null
                      }
                    />
                  </button>
                  <span>{getMealCountInBasket(e._id)}</span>
                  <button
                    onClick={() =>
                      handleCountChange(e._id, getMealCountInBasket(e._id) + 1)
                    }
                  >
                    <BiPlusCircle />
                  </button>
                </div>}
              </div>
            )
        })}
      </div>
    </>
  );
}

function BasketBox({
  modalIsOpen,
  setCurrOp,
  currOp,
  serviceFee,
  closeModal,
  removeMealFromBasket,
  basketItems,
  meals,
  handleCountChange,
  getMealCountInBasket,
  setQeyd,
  setAllerg,
  setStol,
  setOtaq,
  calculateTotalPricePerMeal,
  setBasketItems,
  tableCount,
  roomCount,
  total,
  wpnumber,
  wpText,
  payMethod,
  setPayMethod,
  currentItem,
  qeyd,
  stol,
  otaq,
  allerg,
  setIsBasketOpen,
  currency,
  isCompany,
  language,
  setIsOpen
}) {
  const [orderItems, setOrderItems] = useState({});
  const [hesabText, setHesabText] = useState("");
  const [orderTotal, setOrderTotal] = useState(0);
  const [isPointerDown, setIsPointerDown] = useState(false)
  const [bottomS, setBottomS] = useState(-100)

  useEffect(() => {

    const localOrder = window.localStorage.getItem("Order");
    if (localOrder != null) {
      setOrderItems(JSON.parse(localOrder));
    }

    const handleKeyDown = (e) => {
      if (e.code == "Escape") closeModal();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);

    };
  }, []);

  useEffect(() => {
    window.localStorage.setItem("Order", JSON.stringify(orderItems));
  }, [orderItems]);

  useEffect(() => {
    if (modalIsOpen) {
      document.body.style.overflow = "hidden";
      setBottomS(0)
    }
    if (!modalIsOpen) {
      setTimeout(() => {
        document.body.style.overflow = "auto";
      }, 100);
      setBottomS(-100)
    }
  }, [modalIsOpen]);

  const calculateOrderPricePerMeal = (mealId) => {
    let count = orderItems[mealId] ? orderItems[mealId] : 0;
    const meal = meals.find((m) => m._id === mealId);
    if (meal) {
      return meal.price * count;
    }
    return 0;
  };

  const calculateOrderPrice = () => {
    let total = 0;
    Object.keys(orderItems).forEach((mealId) => {
      total += calculateOrderPricePerMeal(mealId);
    });
    return total;
  };

  useEffect(() => {
    const arr = Object.keys(orderItems).map((mealId) => {
      const meal = meals.find((m) => m._id === mealId);
      let txt;
      if (meal)
        txt = `${meal.name[language]}: ${orderItems[mealId] ? orderItems[mealId] : 0
          } (x${meal.price.toFixed(1)}${(currency == "azn") ? "₼" : ((currency == "usd") ? "$" : (currency == "eur") ? "€" : (currency != null && currency != "") ? currency : "₼")})`;
      return txt;
    });

    const serviceTotal = (serviceFee * calculateOrderPrice()) / 100;
    setHesabText(
      `${arr.join("%0A")}
      ${stol ? `%0A${languageTexts[language].table}: ${stol}` : ""}
      ${otaq ? `%0A${languageTexts[language].room}: ${otaq}` : ""}
      ${serviceFee != 0 ? `%0A${languageTexts[language].servicefee}: ${serviceFee}%` : ""}
      %0A${languageTexts[language].payMethod}: ${payMethod == "cash" ? languageTexts[language].cash : languageTexts[language].card}
      %0A${languageTexts[language].billSum}: ${(calculateOrderPrice() + serviceTotal).toFixed(1)}${(currency == "azn") ? "₼" : ((currency == "usd") ? "$" : (currency == "eur") ? "€" : (currency != null && currency != "") ? currency : "₼")}`
    );

    setOrderTotal(calculateOrderPrice() + serviceTotal);
  }, [orderItems, qeyd, stol, otaq, allerg]);

  useEffect(() => {
    if (
      Object.keys(basketItems).length != 0 ||
      Object.keys(orderItems).length != 0
    )
      setIsBasketOpen(true);
    else setIsBasketOpen(false);
  }, [basketItems, orderItems]);

  const handleOrder = () => {
    let tempObj = { ...orderItems };
    Object.keys(basketItems).forEach((mealId) => {
      tempObj = {
        ...tempObj,
        [mealId]: (tempObj[mealId] ? tempObj[mealId] : 0) + basketItems[mealId],
      };
    });
    setOrderItems(tempObj);
    setBasketItems({});
  };

  const [startHeight, setStart] = useState(0)
  const [endHeight, setEnd] = useState(0)

  const handleDown = (e) => {
    e.target.setPointerCapture(e.pointerId)

    setStart(e.clientY)
    setEnd(e.clientY)
    setIsPointerDown(true)
  }
  const handleMove = (e) => {
    if (!isPointerDown) return
    if (e.clientY >= startHeight) setEnd(e.clientY)
  }

  const handleCancel = (e) => {
    if (endHeight - 150 >= startHeight) {
      closeModal()
    }
    setIsPointerDown(false)
    setStart(0)
    setEnd(0)
  }

  return (
    <>
      {modalIsOpen && (
        <div
          className="basket-container"
        >
          <div
            onPointerDown={handleDown}
            onPointerMove={handleMove}
            onPointerCancel={handleCancel}
            onPointerUp={handleCancel}
            className={`basketbox p-2`}
            style={{
              transform: "translateY(" + (endHeight - startHeight) + "px)",
              bottom: bottomS + '%'
            }}
          >
            {isCompany && <div className="closeButton">
              <button
                onClick={() => {
                  setBottomS(-100)
                  setTimeout(() => {
                    closeModal();
                  }, 300)
                }}
              >
                <div className="relative w-[3em] h-[1.5em] flex justify-center items-center">
                  <div className="w-[60%] h-[5px] bg-gray-300 rounded-lg rotate-[15deg] mr-[-6px]"></div>
                  <div className="w-[60%] h-[5px] bg-gray-300 rounded-lg rotate-[-15deg]"></div>
                </div>
              </button>
            </div>
            }
            {currOp != 2 && !isCompany && (
              <>
                <div className="closeButton">
                  <button
                    onClick={() => {
                      setBottomS(-100)
                      setTimeout(() => {
                        closeModal();
                      }, 300)
                    }}
                  >
                    <div className="relative w-[3em] h-[1.5em] flex justify-center items-center">
                      <div className="w-[60%] h-[5px] bg-gray-300 rounded-lg rotate-[15deg] mr-[-6px]"></div>
                      <div className="w-[60%] h-[5px] bg-gray-300 rounded-lg rotate-[-15deg]"></div>
                    </div>
                  </button>
                </div>
                <div className="flex justify-between h-[2.5em]  font-bold text-[1.2em] items-center gap-[10px] mb-[10px] mt-[-10px]">
                  <div
                    className={`${currOp == 0 ? "bg-[#D9DADA]" : "bg-[#EBECEC]"
                      } w-full px-[1em] py-[0.6em] text-center rounded-[1em]`}
                    onClick={() => {
                      setCurrOp(0);
                    }}
                  >
                    {languageTexts[language].makeOrder}
                  </div>
                  <div className="w-[5px] h-[80%] bg-[#B3B3B3]"></div>
                  <div
                    className={`${currOp == 1 ? "bg-[#D9DADA]" : "bg-[#EBECEC]"
                      } w-full px-[1em] py-[0.6em] text-center rounded-[1em]`}
                    onClick={() => {
                      setCurrOp(1);
                    }}
                  >
                    {languageTexts[language].hesabIste}
                  </div>
                </div>
              </>
            )}
            {currOp == 0 && (
              <div className="p-[10px]">
                <div>
                  <div className="basketUpper">
                    <span className="font-bold text-[1.2em]">
                      {languageTexts[language].orders}
                    </span>
                    <div className="relative">
                      {total ? total.toFixed(1) : 0} {currency.toUpperCase()}{" "}
                      <AiOutlineShoppingCart />
                      {serviceFee != 0 && (
                        <span className="text-[0.8em] text-black absolute bottom-[-20px] right-[10px] font-normal">
                          Servis haqqı {serviceFee}%
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="min-h-[5em] max-h-[9em] overflow-y-scroll">
                    {Object.keys(basketItems).map((mealId, i) => {
                      const meal = meals.find((m) => m._id === mealId);
                      if (meal) {
                        return (
                          <div
                            key={`categ${i}`}
                            className="basketContainer justify-between font-semibold"
                          >
                            <div className="basketItem basketItemW2">
                              <span className="max-w-[50%] text-ellipsis overflow-hidden">
                                {meal.name[language]?meal.name[language]:meal.name.az}
                              </span>
                              <div className="basketItemRight">
                                <div className="countContainer">
                                  <button
                                    onClick={() =>
                                      handleCountChange(
                                        meal._id,
                                        getMealCountInBasket(meal._id) - 1
                                      )
                                    }
                                  >
                                    <BiMinusCircle
                                      style={
                                        getMealCountInBasket(meal._id) === 0
                                          ? { fill: "rgb(176 176 176)" }
                                          : null
                                      }
                                    />
                                  </button>
                                  <span>{getMealCountInBasket(meal._id)}</span>
                                  <button
                                    onClick={() =>
                                      handleCountChange(
                                        meal._id,
                                        getMealCountInBasket(meal._id) + 1
                                      )
                                    }
                                  >
                                    <BiPlusCircle />
                                  </button>
                                </div>
                                <span>
                                  {calculateTotalPricePerMeal(meal._id).toFixed(
                                    1
                                  )}{" "}
                                  {(currency == "azn") ? "₼" : ((currency == "usd") ? "$" : (currency == "eur") ? "€" : (currency != null && currency != "") ? currency : "₼")}
                                </span>
                              </div>
                            </div>
                            <button
                              onClick={() => removeMealFromBasket(meal._id)}
                            >
                              <FontAwesomeIcon
                                icon={faCircleXmark}
                                style={{ width: "2em", height: "2em" }}
                              />
                            </button>
                          </div>
                        );
                      }
                    })}
                  </div>
                  <div className="h-[3em] w-full">
                    <textarea
                      placeholder={languageTexts[language].notes}
                      className="w-full h-full resize-none border border-black rounded-[2em] outline-yellow-300 justify-self text-[0.6em] px-5 py-4"
                      onChange={(e) => {
                        setQeyd(e.target.value);
                      }}
                    />
                  </div>
                  {!isCompany && <div className="h-[3em] w-full mt-[10px]">
                    <textarea
                      placeholder={languageTexts[language].allergy}
                      className="w-full h-full resize-none border border-black rounded-[2em] outline-yellow-300 justify-self text-[0.6em] px-5 py-4"
                      onChange={(e) => {
                        setAllerg(e.target.value);
                      }}
                    />
                  </div>}
                  {tableCount != 0 && (
                    <div className="h-[3em] w-full mt-[5px] flex relative items-center p-2 justify-between">
                      <div className="font-semibold">
                        {languageTexts[language].tableOrder}
                      </div>
                      <select
                        value={stol ? stol : "1"}
                        className="px-2 bg-gray-200 outline-none rounded-[1em] tableSelect"
                        onChange={(e) => {
                          setStol(e.target.value);
                        }}
                      >
                        {[...Array(tableCount ? tableCount : 1)].map((e, i) => (
                          <option key={`tabe${i}`} value={i + 1}>
                            {i + 1}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  {roomCount != 0 && (
                    <div className="h-[3em] w-full mt-[5px] flex relative items-center p-2 justify-between">
                      <div className="font-semibold">
                        {languageTexts[language].roomOrder}
                      </div>
                      <select
                        value={otaq ? otaq : 1}
                        className="px-2 bg-gray-200 outline-none rounded-[1em] tableSelect"
                        onChange={(e) => {
                          setOtaq(e.target.value);
                        }}
                      >
                        {[...Array(roomCount ? roomCount : 1)].map((e, i) => (
                          <option key={`room${i}`} value={i + 1}>
                            {i + 1}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
                <div className="flex justify-between mt-4 mb-3 text-[0.8em] font-semibold">
                  <div
                    className="w-[25%] flex items-center justify-center px-4 border-black border text-center rounded-[1em]"
                    onClick={() => {
                      setBasketItems({});
                    }}
                  >
                    {languageTexts[language].reset}
                  </div>
                  <a
                    target="_blank"
                    onClick={handleOrder}
                    href={`https://wa.me/${wpnumber}?text=${wpText}`}
                    className="bg-black border border-black  rounded-[1em] font-bold py-3 px-4 w-[70%] text-center bg-yellow-400 "
                  >
                    {languageTexts[language].confirmOrder}
                  </a>
                </div>
              </div>
            )}
            {currOp == 1 && (
              <div className="p-[10px]">
                <div className="font-bold text-[1.2em]">{languageTexts[language].billOrder}</div>
                {(stol != null && stol != 0) && <div className="flex justify-between px-3">
                  <div>{languageTexts[language].tableNumber}</div>
                  <div>{stol ? stol : "Yoxdur"}</div>
                </div>}
                {(otaq != null && otaq != 0) && <div className="flex justify-between px-3">
                  <div>{languageTexts[language].roomNumber}</div>
                  <div>{otaq ? otaq : "Yoxdur"}</div>
                </div>}
                <div className="flex justify-between px-3">
                  <div>{languageTexts[language].payMethod}</div>
                  <div>{payMethod == "cash" ? languageTexts[language].cash : languageTexts[language].card}</div>
                </div>
                <div className="max-h-[20vh] border-black overflow-y-scroll scroll-visible">
                  {Object.keys(orderItems).map((mealId) => {
                    const meal = meals.find((m) => m._id === mealId);
                    if (meal) {
                      return (
                        <div
                          key={meal._id}
                          className="basketContainer font-semibold"
                        >
                          <div className="basketItem w-full">
                            <span className=" text-ellipsis	 overflow-hidden">
                              {meal.name[language]?meal.name[language]:meal.name.az}
                            </span>
                            <div className="basketItemRight">
                              <span>
                                {orderItems[mealId] ? orderItems[mealId] : 0}
                              </span>
                              <span>
                                {calculateOrderPricePerMeal(meal._id).toFixed(
                                  1
                                )}{" "}
                                {(currency == "azn") ? "₼" : ((currency == "usd") ? "$" : (currency == "eur") ? "€" : (currency != null && currency != "") ? currency : "₼")}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
                {serviceFee == 1 && (
                  <div className="flex justify-between px-3">
                    && <div>Servis haqqı</div>
                    <div>
                      {serviceFee}% * {calculateTotalPrice().toFixed(1)} ={" "}
                      {((serviceFee * calculateTotalPrice()) / 100).toFixed(1)}{(currency == "azn") ? "₼" : ((currency == "usd") ? "$" : (currency == "eur") ? "€" : (currency != null && currency != "") ? currency : "₼")}
                    </div>
                  </div>
                )}
                <div className="flex justify-between px-3 text-[1.4em] font-bold">
                  <div>{languageTexts[language].billSum}:</div>
                  <div>{orderTotal ? orderTotal.toFixed(1) : 0} {currency.toUpperCase()}</div>
                </div>

                <div className="p-4 flex gap-[10px]">
                  <div className="font-bold">{languageTexts[language].payMethod}:</div>
                  <div className="flex justify-between w-[60%]">
                    <div
                      className="flex items-center gap-[3px]"
                      onClick={() => {
                        setPayMethod("cash");
                      }}
                    >
                      <div className="w-[1.2em] h-[1.2em] aspect-square border-[3px] border-black rounded-[50%] flex justify-center items-center">
                        {payMethod == "cash" && (
                          <div className="bg-black w-[0.5em] rounded-[50%] aspect-square"></div>
                        )}
                      </div>
                      <span>{languageTexts[language].cash}</span>
                    </div>
                    <div
                      className="flex items-center gap-[3px]"
                      onClick={() => {
                        setPayMethod("card");
                      }}
                    >
                      <div className="w-[1.2em] h-[1.2em] aspect-square border-[3px] border-black rounded-[50%] flex justify-center items-center">
                        {payMethod == "card" && (
                          <div className="bg-black w-[0.5em] rounded-[50%] aspect-square"></div>
                        )}
                      </div>
                      <span>{languageTexts[language].card}</span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between gap-[30px] font-semibold">
                  <div
                    className="py-[0.5em] text-[0.8em] flex items-center justify-center text-center w-[30%] border-[1px] border-black rounded-[1em]"
                    onClick={() => {
                      setBasketItems({});
                      setIsOpen(false);
                    }}
                  >
                    {languageTexts[language].cancel}
                  </div>
                  <a
                    target="_blank"
                    href={`https://wa.me/${wpnumber}?text=${hesabText}`}
                    className="py-[0.5em] text-center w-[70%] border-[1px] border-black text-black rounded-[1em] bg-yellow-400 flex items-center justify-center"
                    onClick={() => {
                      setOrderItems({});
                    }}
                  >
                    {languageTexts[language].askBill}
                  </a>
                </div>
              </div>
            )}
            {currOp == 2 && (
              <div className="flex w-full flex-col items-center">
                <button onClick={closeModal} className="absolute z-[2]">
                  <div className="relative w-[3em] h-[1.5em] flex justify-center items-center">
                    <div className="w-[60%] h-[5px] bg-gray-300 rounded-lg rotate-[15deg] mr-[-6px]"></div>
                    <div className="w-[60%] h-[5px] bg-gray-300 rounded-lg rotate-[-15deg]"></div>
                  </div>
                </button>
                <div
                  style={{ backgroundImage: "url(" + (currentItem ? currentItem.pics[0] : placeholder) + ")" }}
                  className="w-full h-[30vh] bg-center bg-cover scale-[1.1]"
                ></div>
                <div className="abolsute text-[1.2em] font-bold px-[1em] text-center mt-[1em]">
                  {currentItem
                    ? currentItem.name[language].charAt(0).toUpperCase() +
                    currentItem.name[language].substr(1).toLowerCase(1)
                    : ""}
                </div>
                <div className="abolsute mb-[1em] text-[1em] px-[1em] text-center">
                  {currentItem ? currentItem.ingredients[language] : ""}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
