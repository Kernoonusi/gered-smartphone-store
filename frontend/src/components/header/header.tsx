import { Link } from "@tanstack/react-router";
import { ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";

import { Input } from "@shadcnUi/input";
import { Button } from "@shadcnUi/button";
import "./header.css";
import { Skeleton } from "@shadcnUi/skeleton";
import { ProfileButton } from "./profileButton";
import { productsService } from "@/services/products.service";
import { IBrand } from "@/types";

function SkeletonBrands() {
  return (
    <>
      <Skeleton className="h-14 w-28" />
      <Skeleton className="h-14 w-28" />
      <Skeleton className="h-14 w-28" />
      <Skeleton className="h-14 w-28" />
      <Skeleton className="h-14 w-28" />
      <Skeleton className="h-14 w-28" />
      <Skeleton className="h-14 w-28" />
    </>
  );
}

export const Header = () => {
  const fetchData = async () => {
    try {
      const response: IBrand[] = await productsService.getBrands(7);
      return response;
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  };

  const [brands, setBrands] = useState<IBrand[]>([]);

  useEffect(() => {
    const fetchDataAsync = async () => {
      const fetchedBrands = await fetchData();
      setBrands(fetchedBrands);
    };

    fetchDataAsync();
  }, []);

  return (
    <>
      <header className="overflow-hidden">
        <div className="w-screen hidden overflow-hidden md:flex flex-col items-center">
          <div className="w-10/12 hidden md:grid grid-cols-[auto_auto_auto_auto_1fr_auto] grid-rows-1 gap-2">
            <Link
              to="/about"
              className="transition-all text-sm p-2 h-full border-b border-black border-opacity-0 hover:border-opacity-100">
              О компании
            </Link>
            <Link
              to="/delivery"
              className="transition-all text-sm p-2 h-full border-b border-black border-opacity-0 hover:border-opacity-100">
              Доставка
            </Link>
            <Link
              to="/warranty"
              className="transition-all text-sm p-2 h-full border-b border-black border-opacity-0 hover:border-opacity-100">
              Гарантия
            </Link>
            <Link
              to="/contacts"
              className="transition-all text-sm p-2 h-full border-b border-black border-opacity-0 hover:border-opacity-100">
              Контакты
            </Link>
            <div />
            <div className="flex gap-4">
              <p className="transition text-sm font-semibold self-end p-2 h-full">
                +7 (999) 999-99-99
              </p>
              <p className="transition text-sm font-semibold self-end p-2 h-full">
                +7 (999) 999-99-99
              </p>
            </div>
          </div>
          <hr className="w-full overflow-hidden" />
          <nav className="w-10/12 py-2 grid grid-cols-[auto_1fr_auto] gap-12 items-center">
            <Link to="/" className="transition-all text-3xl p-2 h-full">
              Gered Store
            </Link>
            <Input placeholder="Поиск..." className="h-full" />
            <div>
              <Link to="/cart">
                <Button variant="ghost" className="h-full gap-4">
                  Корзина
                  <ShoppingCart />
                </Button>
              </Link>
              <ProfileButton rounded />
            </div>
          </nav>
        </div>
      </header>
      <nav className="overflow-hidden sticky top-0 z-50">
        <div className="w-screen overflow-hidden transition-all flex gap-4 md:gap-1 justify-center top-0 bg-fuchsia-900">
          <Link
            to="/"
            className="anim-elem md:flex w-fit transition-all text-3xl p-2 h-full text-cyan-300">
            G
          </Link>
          <Link to="/products">
            <Button variant={"ghost"} className="rounded-none text-white text-2xl py-7 md:mr-10">
              Все смартфоны
            </Button>
          </Link>
          <div className="flex">
            {brands.length == 0 ? (
              <SkeletonBrands />
            ) : (
              brands.map(({ brand }) => (
                <Button
                  variant={"ghost"}
                  className="rounded-none hidden lg:flex text-gray-300 even:hidden xl:even:flex text-2xl xl:text-xl 2xl:text-2xl py-7"
                  key={brand}
                  asChild>
                  <Link to="/products" search={{ brandSearch: brand }}>
                    {brand}
                  </Link>
                </Button>
              ))
            )}
          </div>
          <div className="anim-elem md:ml-10 text-white">
            <Link to="/cart">
              <Button variant="ghost" className="h-full rounded-none gap-4">
                <p className="hidden md:block">Корзина</p>
                <ShoppingCart />
              </Button>
            </Link>
            <ProfileButton />
          </div>
        </div>
      </nav>
    </>
  );
};
