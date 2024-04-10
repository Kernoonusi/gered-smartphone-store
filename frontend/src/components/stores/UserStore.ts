import { ICartItem, IUser } from "@/types";
import ky, { HTTPError } from "ky";
import { create } from "zustand";

type UserStateAction = {
  setUser: () => void;
  updateCart: (cart: ICartItem[]) => void;
  addItemToCart: (product: ICartItem) => void;
};

export const useUserStore = create<IUser & UserStateAction>((set) => ({
  name: "",
  email: "",
  setUser: async () => {
    const user = await ky
      .get("http://gered-store-back.lndo.site/users/me", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      })
      .json<IUser>()
      .catch((error) => {
        if (error instanceof HTTPError) {
          error.response
            .json()
            .then((data: { error?: string }) => console.log(data.error))
            .catch((error) => {
              if (error instanceof HTTPError) {
                error.response.text().then((data) => console.log(data));
              }
            });
        } else {
          console.log(error);
        }
      });
    if (user) {
      set(user);
    }
  },
  updateCart: (cart: ICartItem[]) => set((state) => ({ ...state, cart })),
  addItemToCart: (product: ICartItem) =>
    set((state) => {
      const newCart = state.cart ? [...state.cart, product] : [product];
      return { ...state, cart: newCart };
    }),
}));
