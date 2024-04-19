import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/contacts")({
  component: Contacts,
});

export function Contacts() {
  return (
    <main className="w-full md:w-10/12 flex flex-col gap-12 mx-auto">
      <div className="w-full bg-gray-100 p-12 shadow-lg rounded-xl">
        <h1 className="text-4xl font-bold text-center mb-8">Свяжитесь с нами</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <p className="text-2xl font-bold mb-4">Адрес</p>
            <p>г. Москва, ул. Пушкина, д. 17</p>
          </div>
          <div>
            <p className="text-2xl font-bold mb-4">Контактная информация</p>
            <p>
              <a href="tel:+1234567890">+7 (999) 999-99-99</a>
            </p>
            <p>
              <a href="mailto:info@example.com">info@example.com</a>
            </p>
            <p>Пн-Пт: 9:00 - 18:00</p>
            <p>Сб-Вс: выходной</p>
          </div>
        </div>
      </div>
    </main>
  );
}
