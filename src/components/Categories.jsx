import { useEffect } from "react";
import { BiMinusCircle, BiPlusCircle } from "react-icons/bi";
import { useInView } from "react-intersection-observer";
import { placeholder } from "../assets";

export default function Categories({
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
      setViewCategory(event.name && event.name.az);
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