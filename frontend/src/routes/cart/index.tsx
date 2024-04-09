import { ProductCard } from "@/components/productCard";
import { useUserStore } from "@/components/stores/UserStore";
import { cartService } from "@/services/cart.service";
import { productsService } from "@/services/products.service";
import { IProduct, IUser } from "@/types";
import { Await, createFileRoute, defer } from "@tanstack/react-router";
import ky from "ky";
import { Suspense } from "react";

export const Route = createFileRoute("/cart/")({
  loader: async () => {
    if (useUserStore.getState().user.name === "" && localStorage.getItem("jwt")) {
      const user = await ky
        .get("http://gered-store-back.lndo.site/users/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        })
        .json<IUser>();
      useUserStore.setState({ user: user });
    }
    if (!localStorage.getItem("cart") && localStorage.getItem("jwt")) {
      const cart: IProduct[] = await cartService.getCart();
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
  const cart = useUserStore((state) => state.user.cart);
  return (
    <main className="w-full md:w-10/12 mt-6 flex flex-col gap-12 mx-auto">
      {!cart ? (
        <p className="text-3xl">Ваша корзина пока пуста</p>
      ) : (
        cart.map((item) => <ProductCard key={item.brand + item.nameProduct} item={item} />)
      )}
      <article className="flex gap-4">
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
