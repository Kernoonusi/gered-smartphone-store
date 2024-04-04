import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

import { Header } from "@components/header/header";
import { Footer } from "@components/footer/footer";

export const Route = createRootRoute({
	component: () => (
		<>
			<Header />
			<Outlet />
			<TanStackRouterDevtools />
			<Footer />
		</>
	),
});
