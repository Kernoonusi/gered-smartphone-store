import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/about")({
	component: About,
});

function About() {
	return (
		<main className="w-full md:w-10/12 flex flex-col gap-12 mx-auto">
			<header className="mt-6 bg-gradient-to-r from-purple-500 to-pink-600 flex flex-col justify-center items-center h-[70dvh] w-full">
				<div className="text-white flex flex-col gap-6 p-12">
					<p className="uppercase font-bold text-6xl">Gered Store</p>
					<p className="text-2xl">Мы продаем смартфоны</p>
					<p className="text-lg">
						Добро пожаловать в Gered Store! Мы компания, которая продает
						последние и самые инновационные смартфоны различных брендов. Мы
						предлагаем широкий выбор устройств, включая Apple, Samsung и многие
						другие. Мы стараемся обеспечить вам наилучший опыт при выборе
						своего следующего смартфона.
					</p>
				</div>
			</header>
		</main>
	);
}
