import { OrderForm } from "@/components/cart/order-form";
import { ProductCard } from "@/components/productCard";
import { useUserStore } from "@/components/stores/UserStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { cartService } from "@/services/cart.service";
import { productsService } from "@/services/products.service";
import { ICartItem } from "@/types";
import { Await, createFileRoute, defer } from "@tanstack/react-router";
import { Minus, Plus, Trash } from "lucide-react";
import { Suspense } from "react";

export const Route = createFileRoute("/cart/")({
  loader: async () => {
    if (!localStorage.getItem("cart") && localStorage.getItem("jwt")) {
      const cart: ICartItem[] = await cartService.getCart();
      useUserStore.getState().updateCart(cart);
    }
    if (localStorage.getItem("cart") !== null) {
      const cart: ICartItem[] = JSON.parse(localStorage.getItem("cart")!);
      useUserStore.getState().updateCart(cart);
    }
    const data = productsService.getProducts();
    return {
      products: defer(data),
    };
  },
  component: Index,
});

function Index() {
  const { products } = Route.useLoaderData();
  const cart = useUserStore((state) => state.cart);
  return (
    <main className="w-full md:w-10/12 mt-6 flex flex-col gap-12 mx-auto">
      {cart === undefined ? null : (
        <div className="flex gap-4 items-end">
          <h2 className="text-3xl font-semibold">Корзина</h2>
          <p className="text-zinc-500">
            {cart?.reduce((acc, item) => acc + item.countBasket, 0) || 0} товар(ов),{" "}
            {cart?.reduce((acc, item) => acc + item.price * item.countBasket, 0).toFixed(2) || 0}₽
          </p>
        </div>
      )}
      <div className="flex justify-between gap-4">
        <article className="flex flex-col gap-4">
          {cart === undefined ? (
            <p className="text-3xl">Ваша корзина пока пуста</p>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="grid grid-cols-4 grid-rows-3 gap-2">
                <img src="xiaomiTel.jpg" alt="" className="h-24 w-auto row-span-3" />
                <p className="row-span-1">
                  {item.brand} {item.nameProduct}
                </p>
                <div className="row-span-3 flex justify-center items-center m-auto gap-2">
                  <Button
                    type="button"
                    variant={"ghost"}
                    size={"icon"}
                    onClick={() => cartService.increaseCountBasket(item)}
                    className="text-green-500">
                    <Plus />
                  </Button>
                  <p className="text-center">{item.countBasket}</p>
                  <Button
                    type="button"
                    variant={"ghost"}
                    size={"icon"}
                    onClick={() => cartService.decreaseCountBasket(item)}
                    className="text-red-500">
                    <Minus />
                  </Button>
                </div>
                <Button
                  type="button"
                  variant={"ghost"}
                  size={"icon"}
                  onClick={() => cartService.removeFromCart(item)}
                  className="row-span-3 m-auto flex justify-center items-center text-gray-500">
                  <Trash />
                </Button>
                <p className="row-span-1">{item.price}₽</p>
              </div>
            ))
          )}
        </article>
        <Card className="flex h-fit flex-col justify-between transition-all">
          <CardHeader>
            <CardTitle>К оплате</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="flex gap-10 justify-between">
              Стоимость товаров:{" "}
              <strong>
                {cart?.reduce((acc, item) => acc + item.price * item.countBasket, 0).toFixed(2)}₽
              </strong>
            </p>
          </CardContent>
          <CardFooter className="flex items-start flex-col gap-4">
            <p>
              Итого: <br />
              <p className="text-5xl font-semibold">
                {cart?.reduce((acc, item) => acc + item.price * item.countBasket, 0).toFixed(2)}₽
              </p>
            </p>
            {useUserStore.getState().email ? (
              <Dialog>
                <DialogTrigger>
                  <Button>Перейти к оформлению</Button>
                </DialogTrigger>
                <DialogContent>
                  <OrderForm />
                </DialogContent>
              </Dialog>
            ) : (
              <Button>Необходима авторизация</Button>
            )}
          </CardFooter>
        </Card>
      </div>
      <h2>Рекомендуем</h2>
      <article className="grid grid-cols-5 gap-4">
        <Suspense fallback={<div></div>}>
          <Await promise={products}>
            {(data) => {
              return data.map((item) => (
                <ProductCard key={item.brand + item.nameProduct} item={item} />
              ));
            }}
          </Await>
        </Suspense>
      </article>
    </main>
  );
}
