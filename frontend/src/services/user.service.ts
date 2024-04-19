import { useUserStore } from "@/components/stores/UserStore";
import { kyApi } from "@/lib/ky";
import { KyHeadersInit } from "node_modules/ky/distribution/types/options";

interface IUserGet {
  id: number;
  name: string;
  email: string;
  address: string;
  role: string;
}

export const userService = {
  login: async (email: string, password: string) => {
    const response = await kyApi
      .post("users/login", {
        json: {
          email,
          password,
        },
      })
      .json<{ message?: string; jwt?: string; error?: string }>();

    return response;
  },
  getUser: async () => {
    const user: IUserGet = await kyApi
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
  getAllUsers: async () => {
    const users: IUserGet[] = await kyApi.get("users/getAll").json();
    return users;
  },
  deleteUser: async (id: number) => {
    const response = await kyApi
      .post("users/delete", {
        json: {
          id,
        },
      })
      .json();
    return response;
  },
  updateUserRole: async (id: number, role: string) => {
    const response = await kyApi
      .post("users/updateRole", {
        json: {
          id,
          role_id: role,
        },
      })
      .json();
    return response;
  },
  updateUser: async (name: string, email: string, address?: string, id?: number) => {
    const response = await kyApi
      .post("users/update", {
        json: {
          id,
          name,
          email,
          address,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      })
      .json();
    return response;
  },
  updatePassword: async (password: string, email?: string) => {
    const headers: KyHeadersInit | undefined = localStorage.getItem("jwt")
      ? {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        }
      : undefined;
    const response = await kyApi
      .post("users/update", {
        json: {
          email,
          password,
        },
        headers,
      })
      .json();
    return response;
  },
};
