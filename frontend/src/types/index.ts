export interface IProduct {
  id: number;
  nameProduct: string;
  price: number;
  description: string;
  ram: number;
  storage: number;
  soc: string;
  weight: number;
  size: string;
  brand: string;
  releaseYear: number;
  count: number;
}

export interface ICartItem extends IProduct {
  countBasket: number;
}

export interface IUser {
  name: string;
  email: string;
  cart?: ICartItem[];
  address?: string;
}

export interface IBrand {
  brand: string;
}

interface IFilterWithoutBrand {
  minPrice: number;
  maxPrice: number;
  minRam: number;
  maxRam: number;
  minStorage: number;
  maxStorage: number;
  minSize: number;
  maxSize: number;
  minWeight: number;
  maxWeight: number;
};

export interface IFilter {
  filters: IFilterWithoutBrand;
  brands: IBrand[];
}

interface IFilterSendWithoutBrand {
  minPrice?: number;
  maxPrice?: number;
  minRam?: number;
  maxRam?: number;
  minStorage?: number;
  maxStorage?: number;
  minSize?: number;
  maxSize?: number;
  minWeight?: number;
  maxWeight?: number;
};

export interface IFilterSend {
  filters?: IFilterSendWithoutBrand;
  brands?: IBrand[];
}

export interface IOrder {
  address: string;
  note?: string;
  products: {
    id: number;
    count: number;
  }[];
}

export interface IOrderProfile {
  status: string;
  note?: string;
  products: {
    id: number;
    name: string;
    price: number;
    count: number;
  }[];
  total: number;
}