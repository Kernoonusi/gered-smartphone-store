import { IProduct } from "@/types";
import ky, { HTTPError } from "ky";

export const productsService = {
  getProducts: async () => {
    try {
      const response: IProduct[] = await ky
        .get("http://gered-store-back.lndo.site/products?limit=5")
        .json();
      return response;
    } catch (error) {
      if (error instanceof HTTPError) {
        const errorData = await error.response.json();
        console.log(errorData.error);
      } else {
        console.log(error);
      }
      return [];
    }
  },
};
