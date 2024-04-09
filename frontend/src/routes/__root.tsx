import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

import { Toaster } from "@/components/ui/toaster"
import { Header } from "@components/header/header";
import { Footer } from "@components/footer/footer";

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
});
