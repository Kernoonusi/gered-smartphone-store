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
          localStorage.setItem("cart", JSON.stringify([...prev, product]));
        } else {
          localStorage.setItem("cart", JSON.stringify([product]));
        }
      });
  },
};
