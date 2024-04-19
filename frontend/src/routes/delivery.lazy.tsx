import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/delivery")({
	component: Delivery,
});

export function Delivery() {
    return (
        <main className="w-full mt-6 md:w-10/12 flex flex-col gap-12 mx-auto">
            <div className="w-full bg-slate-100 rounded-xl p-12">
                <h1 className="text-4xl mb-8 text-center">Доставка</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 place-items-center gap-8">
                    <div>
                        <h2 className="text-2xl mb-4">Способы доставки:</h2>
                        <ul className="list-disc pl-6">
                            <li>Доставка курьером</li>
                            <li>Доставка по почте</li>
                            <li>Самовывоз из нашего магазина</li>
                        </ul>
                    </div>
                    <div>
                        <h2 className="text-2xl mb-4">Способы оплаты:</h2>
                        <ul className="list-disc pl-6">
                            <li>Наличными при получении</li>
                            <li>Банковской картой</li>
                            <li>Наложенным платежом</li>
                        </ul>
                    </div>
                </div>
                <div className="mt-8">
                    <p className="text-center">Обрабатываем заказы <strong>с понедельника по пятницу</strong> с 9 до 20</p>
                </div>
            </div>
        </main>
    );
}