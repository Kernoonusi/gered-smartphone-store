import { kyApi } from "@/lib/ky";
import { IProduct } from "@/types";

export const productsService = {
  getProducts: async ( limit = 5) => {
    const response: IProduct[] = await kyApi.get(`products?limit=${limit}`).json();
    return response;
  },
  getProduct: async (id: string) => {
    const response: IProduct = await kyApi.get(`products?id=${id}`).json();
    return response;
  },
};
