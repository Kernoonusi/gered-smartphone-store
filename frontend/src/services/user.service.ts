import { useUserStore } from "@/components/stores/UserStore";
import { kyApi } from "@/lib/ky";

export const userService = {
  getUser: async () => {
    const user = await kyApi
      .get("users/me", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      })
      .json();
    return user;
  },
  logout: async () => {
    useUserStore.setState({ name: "", email: "" });
    localStorage.removeItem("jwt");
  },
  getRole: async () => {
    const role: { role: number } = await kyApi
      .get("users/admin", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      })
      .json();
    const isAdmin = role.role === 2;
    return isAdmin;
  },
};
