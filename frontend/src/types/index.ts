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
    count: number;
}

export interface ICartItem extends IProduct {
    countBasket: number;
}

export interface IUser {
    name: string;
    email: string;
    cart?: ICartItem[]
}