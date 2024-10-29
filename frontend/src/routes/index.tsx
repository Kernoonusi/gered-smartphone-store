import { Link, createFileRoute } from "@tanstack/react-router";
import ky from "ky";

import { Button } from "@components/ui/button";
import { useEffect, useState } from "react";
import { IProduct, IUser } from "@/types";
import { useUserStore } from "@/components/stores/UserStore";
import { ProductCard } from "@/components/productCard";

export const Route = createFileRoute("/")({
  loader: async () => {
    if (useUserStore.getState().name === "" && localStorage.getItem("jwt")) {
      const user = await ky
        .get("http://104.252.127.196/api/users/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        })
        .json<IUser>();
      useUserStore.setState(user);
    }
  },
  component: Index,
});

function Index() {
  const fetchData = async () => {
    try {
      const response: IProduct[] = await ky(
        "http://104.252.127.196/api/products?limit=5",
      ).json();
      return response;
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
      <header className="flex flex-col text-center md:text-left md:flex-row gap-10 justify-center items-center h-[70dvh] w-full">
        <div className="flex flex-col gap-6">
          <p className="uppercase font-semibold text-6xl">
            Новый XPhone Pro <br /> вышел
          </p>
          <Button className="w-fit mx-auto md:mx-0 bg-cyan-500 p-8 rounded-full" asChild>
            <Link to="/products/$productId" params={{ productId: "23" }}>Смотреть</Link>
          </Button>
        </div>
        <img src="iphone16.png" alt="" className="md:w-1/2" />
      </header>
      <article className="grid grid-cols-[auto_1fr_auto] grid-rows-[auto_auto] gap-4 items-center">
        <h2 className="text-4xl">Новинки</h2>
        <div />
        <Link to="/products" className="after:content-['->']">
          Все новинки
        </Link>
        <div className="w-full overflow-x-scroll md:overflow-hidden col-span-3 row-span-1 grid grid-cols-[repeat(5,minmax(200px,1fr))] gap-4">
          {data.map((item) => (
            <ProductCard key={item.id} item={item} />
          ))}
        </div>
      </article>
      <article className="grid grid-cols-[auto_1fr_auto] grid-rows-[auto_auto] gap-4 items-center">
        <h2 className="text-4xl">Рекомендуем</h2>
        <div />
        <Link to="/products" className="after:content-['->']">
          Все товары
        </Link>
        <div className="w-full overflow-x-scroll md:overflow-hidden col-span-3 row-span-1 grid grid-cols-[repeat(5,minmax(200px,1fr))] gap-4">
          {data.map((item) => (
            <ProductCard key={item.id} item={item} />
          ))}
        </div>
      </article>
    </main>
  );
}
