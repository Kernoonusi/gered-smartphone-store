import { useUserStore } from "@/components/stores/UserStore";
import { kyApi } from "@/lib/ky";
import { ICartItem, IProduct } from "@/types";

export const cartService = {
  getCart: async () => {
    const response: ICartItem[] = await kyApi
      .get("cart/me", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      })
      .json();
    localStorage.setItem("cart", JSON.stringify(response));
    return response;
  },
  addToCart: async (product: IProduct) => {
    const newCartItem: ICartItem = {
      ...product,
      countBasket: 1,
    };
    await kyApi
      .post("cart/add", {
        json: { product_id: product.id, countBasket: 1 },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      })
      .json()
      .then(() => {
        if (localStorage.getItem("cart") !== null) {
          const prev: ICartItem[] = JSON.parse(localStorage.getItem("cart")!);
          localStorage.setItem("cart", JSON.stringify([...prev, newCartItem]));
        } else {
          localStorage.setItem("cart", JSON.stringify([newCartItem]));
        }
        useUserStore.getState().addItemToCart(newCartItem);
      });
  },
  removeFromCart: async (product: ICartItem) => {
    await kyApi
      .post("cart/remove", {
        json: { product_id: product.id },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      })
      .json()
      .then(() => {
        if (localStorage.getItem("cart") !== null) {
          const prev: ICartItem[] = JSON.parse(localStorage.getItem("cart")!);
          localStorage.setItem(
            "cart",
            JSON.stringify(prev.filter((item) => item.id !== product.id)),
          );
          useUserStore.getState().updateCart(JSON.parse(localStorage.getItem("cart")!));
        }
      });
  },
  increaseCountBasket: async (product: ICartItem) => {
    if (localStorage.getItem("cart") !== null) {
      const prev: ICartItem[] = JSON.parse(localStorage.getItem("cart")!);
      prev[prev.findIndex((item) => item.id === product.id)].countBasket++;
      localStorage.setItem("cart", JSON.stringify(prev));
      useUserStore.getState().updateCart(JSON.parse(localStorage.getItem("cart")!));
    }
  },
  decreaseCountBasket: async (product: ICartItem) => {
    if (localStorage.getItem("cart") !== null) {
      const prev: ICartItem[] = JSON.parse(localStorage.getItem("cart")!);
      prev[prev.findIndex((item) => item.id === product.id)].countBasket--;
      if (prev[prev.findIndex((item) => item.id === product.id)].countBasket <= 0) {
        cartService.removeFromCart(product);
      } else {
        localStorage.setItem("cart", JSON.stringify(prev));
        useUserStore.getState().updateCart(JSON.parse(localStorage.getItem("cart")!));
      }
    }
  },
  clearCart: async () => {
    localStorage.removeItem("cart");
    useUserStore.getState().updateCart([]);
    kyApi
      .post("cart/clear", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      })
      .json();
  },
};
