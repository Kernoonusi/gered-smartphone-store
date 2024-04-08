import { IUser } from "@/types";
import ky from "ky";
import { create } from "zustand";

interface UserState {
  user: IUser;
  setUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: {
    name: "",
    email: "",
  },
  setUser: async () => {
    const user = await ky.get("http://gered-store-back.lndo.site/users/me", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
    }).json<IUser>();
    localStorage.setItem("user", JSON.stringify(user));
    set({ user });
  },
}));
