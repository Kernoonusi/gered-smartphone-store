import { kyApi } from "@/lib/ky";
import { IOrder } from "@/types";


export const orderService = {
    createOrder: async (orderData: IOrder) => {
        await kyApi
            .post("order/create", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("jwt")}`,
                },
                json: orderData,
            })
            .json();
    },
    getOrders: async () => {
        return await kyApi
            .get("order/me", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("jwt")}`,
                },
            })
            .json();
    },
}