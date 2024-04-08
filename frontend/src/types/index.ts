export interface IProduct {
    nameProduct: string;
    price: number;
    description: string;
    ram: number;
    storage: number;
    soc: string;
    weight: number;
    size: string;
    brand: string;
    count: number;
}

export interface IUser {
    name: string;
    email: string;
    cart?: IProduct[]
}