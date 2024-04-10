import { ICartItem, IUser } from "@/types";
import ky, { HTTPError } from "ky";
import { create } from "zustand";

interface UserState {
  user: IUser;
  setUser: () => void;
  updateCart: (cart: ICartItem[]) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: {
    name: "",
    email: "",
  },
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
      set({ user });
    }
  },
  updateCart: (cart: ICartItem[]) => set(state => ({...state, user: {...state.user, cart}})),
  addItemToCart: (product: ICartItem) => set((state) => {
    if(state.user.cart === undefined) {
      return {
        user: { ...state.user, cart: [product] }
      };
    }
    const newCart = [...state.user.cart, product];
    return {
      user: { ...state.user, cart: newCart }
    };
  }),
}));
