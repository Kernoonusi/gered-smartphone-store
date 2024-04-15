import { kyApi } from "@/lib/ky";
import { IOrder, IOrderProfile } from "@/types";

interface IOrderProfileData {
  id: number;
  status: string;
  note?: string;
  ids: string;
  quantities: string;
  nameProducts: string;
  prices: string;
  total: number;
}

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
    const orders: IOrderProfileData[] = await kyApi
      .get("order/me", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      })
      .json();
    const preparedOrders: IOrderProfile[] = orders.map((order) => {
      const productIds = order.ids.split(";");
      const quantities = order.quantities.split(";");
      const nameProducts = order.nameProducts.split(";");
      const prices = order.prices.split(";");
      const products: IOrderProfile["products"] = productIds.map((id, index) => ({
        id: Number(id),
        name: nameProducts[index],
        price: Number(prices[index]),
        count: Number(quantities[index]),
      }));
      return {
        status: order.status,
        note: order.note,
        products,
        total: order.total,
      };
    });
    console.log(preparedOrders);
    
    return preparedOrders;
  },
};
