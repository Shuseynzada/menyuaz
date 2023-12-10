import { useEffect, useState } from "react";
import { languageTexts } from "../constans";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { BiMinusCircle, BiPlusCircle } from "react-icons/bi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";

export default function BasketBox({
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
                                  {meal.name[language] ? meal.name[language] : meal.name.az}
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
                                {meal.name[language] ? meal.name[language] : meal.name.az}
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
  