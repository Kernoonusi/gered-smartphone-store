import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/warranty")({
  component: Warranty,
});

export function Warranty() {
  return (
    <main className="w-full mt-6 md:w-10/12 flex flex-col gap-12 mx-auto">
      <div className="w-full flex flex-col items-center gap-12 p-12 bg-white md:p-24 md:gap-20 border-t border-b border-gray-200">
        <h1 className="text-4xl font-bold text-center">Информация о гарантии</h1>
        <p className="text-2xl text-center">
          Мы предлагаем гарантию на 2 года для всех товаров, которые мы продаем на нашем сайте
        </p>

        <div className="w-full flex flex-col md:flex-row justify-center gap-12">
          <div className="w-full md:w-2/3">
            <p className="text-lg leading-relaxed">
              <span className="font-bold">
                Подробную информацию уточняйте у менеджера по телефону.
              </span>
              <br />
              <span className="font-bold">
                Основанием для гарантии является гарантийный талон или другие документы,
                предоставляемые маркетплейсом Gered Store или магазином-партнёром;
              </span>
              <br />
              <span className="font-bold">
                Транспортировка товара весом менее 5 кг обратно продавцу для обмена/возврата, а
                также для диагностики и гарантийного обслуживания производится покупателем
                самостоятельно.
              </span>
            </p>
          </div>
          <div className="w-full md:w-1/3">
            <ul className="space-y-4">
              <li className="text-lg font-bold">2 года гарантии</li>
              <li className="text-lg">Бесплатная доставка</li>
              <li className="text-lg">Бесплатный возврат</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
