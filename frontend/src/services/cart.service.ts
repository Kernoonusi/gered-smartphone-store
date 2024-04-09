import { IProduct } from "@/types";
import ky from "ky";

export const cartService = {
  getCart: async () => {
    const response: IProduct[] = await ky.get("http://gered-store-back.lndo.site/cart").json();
    return response;
  },
  addToCart: async (product: IProduct) => {
    await ky
      .post("http://gered-store-back.lndo.site/cart", {
        json: { product },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      })
      .json();
  },
};
