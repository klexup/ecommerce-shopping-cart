import React, { useEffect, useState } from "react";
import ShopItem from "../components/ShopItem";

export default function Shop() {
  const [shopItems, setShopItems] = useState([]);
  const [mensFilterToggle, setMensFilterToggle] = useState(false);
  const [womansFilterToggle, setWomansFilterToggle] = useState(false);
  const [jewelryFilterToggle, setJewelryFilterToggle] = useState(false);
  const [loadingState, setLoadingState] = useState(true);
  const [errorState, setErrorState] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch("https://fakestoreapi.com/products", { signal: controller.signal })
      .then((res) => res.json())
      .then((json) => {
        let defaultState = json.filter((item) => {
          if (item.category === "men's clothing") return true;
          if (item.category === "women's clothing") return true;
          if (item.category === "jewelery") return true;
          return false;
        });
        setShopItems(defaultState);
      })
      .catch((error) => {
        console.log(error);
        setErrorState(error);
      })
      .finally(() => {
        setLoadingState(false);
      });

    return () => controller.abort();
  }, []);

  const filteredItems = shopItems.filter((item) => {
    if (!mensFilterToggle && !womansFilterToggle && !jewelryFilterToggle)
      return true;
    if (mensFilterToggle && item.category === "men's clothing") return true;
    if (womansFilterToggle && item.category === "women's clothing") return true;
    if (jewelryFilterToggle && item.category === "jewelery") return true;
    return false;
  });

  const filteredShopItems =
    filteredItems.length < 1 ? (
      <h1>loading...</h1>
    ) : (
      filteredItems.map((item, index) => <ShopItem key={index} {...item} />)
    );

  if (loadingState) {
    return (
      <>
        <div className="flex h-52 items-center justify-center">
          <img
            src="/images/icons/loading-icon.png"
            alt="loading-icon"
            className="w-20 max-w-full animate-spin"
          />
        </div>
      </>
    );
  }
  if (errorState) {
    return (
      <>
        <div className="flex h-screen items-center justify-center">
          <img
            src="/images/icons/error404-icon.png"
            alt="error icon"
            className="w-72 max-w-full"
          />
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex flex-col">
        <div className="flex items-center justify-center gap-2 font-poppins">
          <label>
            <input
              type="checkbox"
              checked={mensFilterToggle}
              onChange={() => setMensFilterToggle((prev) => !prev)}
            />
            <span className="pl-1">Men's</span>
          </label>
          <label>
            <input
              type="checkbox"
              checked={womansFilterToggle}
              onChange={() => setWomansFilterToggle((prev) => !prev)}
            />
            <span className="pl-1">Women's</span>
          </label>
          <label>
            <input
              type="checkbox"
              checked={jewelryFilterToggle}
              onChange={() => setJewelryFilterToggle((prev) => !prev)}
            />
            <span className="pl-1">Jewelry</span>
          </label>
        </div>

        <div className="grid min-h-screen max-w-2xl grid-cols-2 items-center justify-items-center gap-2 bg-white sm:m-auto md:grid-cols-3 lg:max-w-6xl lg:grid-cols-4 ">
          {filteredShopItems}
        </div>
      </div>
    </>
  );
}
