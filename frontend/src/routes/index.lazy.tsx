import { Link, createLazyFileRoute } from "@tanstack/react-router";
import axios from "axios";

import { Button } from "@components/ui/button";
// eslint-disable-next-line import/named
import { ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { IProduct } from "@/types";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  const fetchData = async () => {
    try {
      const response = await axios.get("http://gered-store-back.lndo.site/products?limit=6");
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  };

  const [data, setData] = useState<IProduct[]>([]);

  useEffect(() => {
    const fetchDataAsync = async () => {
      const fetchedData = await fetchData();
      setData(fetchedData);
    };

    fetchDataAsync();
  }, []);

  return (
    <main className="w-full md:w-10/12 flex flex-col gap-12 mx-auto">
      <header className="flex gap-10 justify-center items-center h-[70dvh] w-full">
        <div className="flex flex-col gap-6">
          <p className="uppercase font-semibold text-6xl">
            iphone 16 ultra <br /> и mini
          </p>
          <Button className="w-fit bg-cyan-500 p-8 rounded-full">Смотреть</Button>
        </div>
        <img src="iphone16.png" alt="" className="w-1/2" />
      </header>
      <article className="grid grid-cols-[auto_1fr_auto] grid-rows-[auto_auto] gap-4 items-center">
        <h2 className="text-4xl">Новинки</h2>
        <div />
        <Link to="/" className="after:content-['->']">
          Все новинки
        </Link>
        <div className="w-full col-span-3 row-span-1 grid grid-cols-6 gap-4">
          {data.map(({ nameProduct: name, brand, price}, index) => (
            <article
              className="grid grid-cols-2 grid-rows-[auto_auto_auto] gap-4 items-center"
              key={index}>
              <img src={"xiaomiTel.jpg"} alt={""} className="col-span-2" />
              <Link to="/" className="col-span-2 capitalize text-xl">
                {brand + " " + name}
              </Link>
              <p className="flex items-center text-xl">
                {price} ₽{" "}
              </p>
              <Button variant={"ghost"} className="w-fit justify-self-end rounded-full">
                <ShoppingCart />
              </Button>
            </article>
          ))}
        </div>
      </article>
      <article className="grid grid-cols-[auto_1fr_auto] grid-rows-[auto_auto] gap-4 items-center">
        <h2 className="text-4xl">Рекомендуем</h2>
        <div />
        <Link to="/" className="after:content-['->']">
          Все товары
        </Link>
        <div className="w-full col-span-3 row-span-1 grid grid-cols-6 gap-4">
          {data.map(({ nameProduct: name, brand, price}, index) => (
            <article
              className="grid grid-cols-2 grid-rows-[auto_auto_auto] gap-4 items-center"
              key={index}>
              <img src={"xiaomiTel.jpg"} alt={""} className="col-span-2" />
              <Link to="/" className="col-span-2 capitalize text-xl">
                {brand + " " + name}
              </Link>
              <p className="flex items-center text-xl">
                {price} ₽{" "}
              </p>
              <Button variant={"ghost"} className="w-fit justify-self-end rounded-full">
                <ShoppingCart />
              </Button>
            </article>
          ))}
        </div>
      </article>
    </main>
  );
}
