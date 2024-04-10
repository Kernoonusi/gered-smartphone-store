import { kyApi } from "@/lib/ky";
import { IProduct } from "@/types";

export const productsService = {
  getProducts: async () => {
    const response: IProduct[] = await kyApi.get("products?limit=5").json();
    return response;
  },
};
