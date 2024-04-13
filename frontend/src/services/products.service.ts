import { kyApi } from "@/lib/ky";
import { IBrand, IFilter, IProduct } from "@/types";

export const productsService = {
  getProducts: async (limit = 5, filters: IFilter | null = null) => {
    if (!filters) return (await kyApi.get(`products?limit=${limit}`).json()) as IProduct[];
    const { filters: filt, brands } = filters || {};
    const preparedFilters = filters
      ? `&minPrice=${filt.minPrice}&maxPrice=${filt.maxPrice}&brand=${brands[0].brand}&minRam=${filt.minRam}&maxRam=${filt.maxRam}&minStorage=${filt.minStorage}&maxStorage=${filt.maxStorage}&minSize=${filt.minSize}&maxSize=${filt.maxSize}&minWeight=${filt.minWeight}&maxWeight=${filt.maxWeight}`
      : "";
    console.log(preparedFilters);

    const response: IProduct[] = await kyApi
      .get(`products?limit=${limit}${filters ? `${preparedFilters}` : ""}`)
      .json();
    return response;
  },
  getProduct: async (id: string) => {
    const response: IProduct = await kyApi.get(`products?id=${id}`).json();
    return response;
  },
  getBrands: async (limit = 0) => {
    const response: IBrand[] = await kyApi
      .get(`products/brands${limit === 0 ? "" : `?limit=${limit}`}`)
      .json();
    return response;
  },
  getFilters: async () => {
    const response: IFilter = await kyApi.get("products/filters").json();
    return response;
  },
};
