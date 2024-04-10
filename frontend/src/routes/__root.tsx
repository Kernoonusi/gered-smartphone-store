import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

import { Toaster } from "@/components/ui/toaster";
import { Header } from "@components/header/header";
import { Footer } from "@components/footer/footer";
import { useUserStore } from "@/components/stores/UserStore";
import { kyApi } from "@/lib/ky";
import { IUser } from "@/types";

export const Route = createRootRoute({
  component: () => (
    <>
      <Header />
      <Outlet />
      <TanStackRouterDevtools />
      <Footer />
      <Toaster />
    </>
  ),
  loader: async () => {
    if (useUserStore.getState().name === "" && localStorage.getItem("jwt")) {
      const user = await kyApi
        .get("users/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        })
        .json<IUser>();
      useUserStore.setState(user);
    }
  },
});
