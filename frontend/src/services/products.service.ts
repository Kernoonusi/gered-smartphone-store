import { addProductSchema } from "@/components/admin/add-form";
import { kyApi } from "@/lib/ky";
import { IBrand, IFilter, IProduct } from "@/types";
import { z } from "zod";

export const productsService = {
  getProducts: async (limit = 5, filters: IFilter | null = null) => {
    if (!filters) return (await kyApi.get(`products?limit=${limit}`).json()) as IProduct[];
    const { filters: filt, brands } = filters || {};
    const brandsArray = brands[0] ? brands.map((brand) => brand.brand) : [];

    const preparedFilters = filters
      ? `&minPrice=${filt.minPrice}&maxPrice=${filt.maxPrice}&brand=${brands[0] ? brandsArray.join("_") : "all"}&minRam=${filt.minRam}&maxRam=${filt.maxRam}&minStorage=${filt.minStorage}&maxStorage=${filt.maxStorage}&minSize=${filt.minSize}&maxSize=${filt.maxSize}&minWeight=${filt.minWeight}&maxWeight=${filt.maxWeight}`
      : "";
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
  addProduct: async (product: z.infer<typeof addProductSchema>) => {
    const productFormData = new FormData();
    productFormData.append("nameProduct", product.nameProduct);
    productFormData.append("price", String(product.price));
    productFormData.append("description", product.description);
    productFormData.append("ram", String(product.ram));
    productFormData.append("storage", String(product.storage));
    productFormData.append("size", product.size);
    productFormData.append("brand", product.brand);
    productFormData.append("soc", product.soc);
    productFormData.append("weight", String(product.weight));
    productFormData.append("releaseYear", String(product.releaseYear));
    productFormData.append("count", String(product.count));
    Array.from(product.images as FileList).forEach(file => {
      productFormData.append('images[]', file);
    });
    const response = await kyApi
      .post("products/create", {
        body: productFormData,
      })
      .text();

    console.log(response);
    return response;
  },
};
