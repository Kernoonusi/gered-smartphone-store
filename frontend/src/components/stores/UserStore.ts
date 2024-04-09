import { IProduct, IUser } from "@/types";
import ky, { HTTPError } from "ky";
import { create } from "zustand";

interface UserState {
  user: IUser;
  setUser: () => void;
  updateCart: (cart: IProduct[]) => void;
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
  updateCart: (cart: IProduct[]) => set((state) => ({ ...state, cart })),
}));
