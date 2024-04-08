import { useUserStore } from "@/components/stores/UserStore";
import { IUser } from "@/types";
import { createFileRoute } from "@tanstack/react-router";
import ky from "ky";

export const Route = createFileRoute("/cart/")({
  loader: async () => {
    if (localStorage.getItem("user")) {
      const user = JSON.parse(localStorage.getItem("user") as string) as IUser;
      useUserStore.setState({ user: user });
    } else if (localStorage.getItem("jwt")) {
      const user = await ky
        .get("http://gered-store-back.lndo.site/users/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        })
        .json<IUser>();
      useUserStore.setState({ user: user });
    }
  },
  component: Index,
});

function Index() {
  return <main className="w-full md:w-10/12 flex flex-col gap-12 mx-auto"></main>;
}
