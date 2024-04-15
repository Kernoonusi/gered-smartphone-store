import { productsService } from "@/services/products.service";
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IProduct } from "@/types";
import { cartService } from "@/services/cart.service";

export const Route = createFileRoute("/products/$productId")({
  component: Index,
  loader: async ({ params }) => {
    return await productsService.getProduct(params.productId);
  },
});

export function Index() {
  const product = Route.useLoaderData();
  const addCart = (item: IProduct) => {
    cartService.addToCart(item);
  };
  return (
    <div className="w-full md:w-10/12 mt-6 flex flex-col gap-12 mx-auto">
      <header className="grid grid-cols-[auto_auto_auto] grid-rows-[auto_auto]">
        <img src={"http://gered-store-back.lndo.site/smartphones/xiaomiTel.jpg"} alt="" className="max-w-sm row-span-2" />
        <p className="text-4xl font-semibold col-span-2">
          Смартфон {product.brand} {product.nameProduct} {product.ram}гб + {product.storage}гб
        </p>
        <div />
        <div className="flex flex-col justify-between bg-slate-200 rounded-3xl p-6">
          <p className="text-4xl font-semibold">{product.price}₽</p>
          <p>в наличии: {product.count}</p>
          <Button onClick={() => addCart(product)} className="grid grid-cols-[auto_auto_1fr_auto] bg-cyan-500 place-content-center px-6 py-6 gap-2">
            <ShoppingCart />
            В корзину
            <div />
            <p>{product.price}₽</p>
          </Button>
        </div>
      </header>
      <div className="flex flex-col gap-4">
        <Tabs defaultValue="description" className="w-[400px]">
          <TabsList>
            <TabsTrigger value="description">Описание</TabsTrigger>
            <TabsTrigger value="characteristics">Характеристики</TabsTrigger>
          </TabsList>
          <TabsContent value="description">{product.description}</TabsContent>
          <TabsContent value="characteristics">
            <p>Процессор: {product.soc}</p>
            <p>Оперативная память: {product.ram}гб</p>
            <p>Встроенная память: {product.storage}гб</p>
            <p>Вес: {product.weight}г</p>
            <p>Диагональ: {product.size}&quot;</p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
