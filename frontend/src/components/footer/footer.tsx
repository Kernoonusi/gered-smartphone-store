import { Link } from "@tanstack/react-router";
// eslint-disable-next-line import/named
import { CreditCard, Gift, LucideIcon, Plane, Truck, UserCheck } from "lucide-react";

const adv: {
  title: string;
  description: string;
  icon: LucideIcon;
}[] = [
  {
    title: "Бесплатная доставка",
    description: "Доставка по всему миру бесплатно",
    icon: Truck,
  },
  {
    title: "Возврат и обмен",
    description: "Возврат или обмен в течение 30 дней",
    icon: CreditCard,
  },
  {
    title: "Скидки до 30%",
    description: "Каждый день, специально для вас",
    icon: Gift,
  },
  {
    title: "Подарочные карты",
    description: "Подарочные карты",
    icon: UserCheck,
  },
  {
    title: "Доставка по всей России",
    description: "В любую точку России за 2-3 дня",
    icon: Plane,
  },
];

export function Footer() {
  return (
    <footer className="w-full mt-20 justify-center items-center flex flex-col gap-12 mx-auto">
      <article className="grid grid-cols-2 xl:flex px-12 py-6 bg-fuchsia-900 gap-4 md:w-10/12">
        {adv.map(({ title, description, icon: Icon }, index) => (
          <div className="flex flex-[1_1_0] flex-col last:col-span-2 xl:last:col-span-1 gap-4" key={index}>
            <Icon size={48} color="white" />
            <h2 className="text-3xl text-white">{title}</h2>
            <p className="text-white">{description}</p>
          </div>
        ))}
      </article>
      <hr />
      <footer className="bg-slate-900 w-full py-6 md:py-12 text-center text-slate-200">
        <p className="uppercase font-semibold">© 2023 Gered smartphone store</p>
        <ul className="flex flex-wrap justify-center gap-8 mt-6">
          <li>
            <Link
              to="/"
              className="hover:text-white hover:underline"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}>
              Главная
            </Link>
          </li>
          <li>
            <Link to="/policy" className="hover:text-white hover:underline">
              Политика конфиденциальности
            </Link>
          </li>
          <li>
            <Link
              to="/about"
              className="transition-all text-sm p-2 h-full border-b border-black border-opacity-0 hover:border-opacity-100">
              О компании
            </Link>
          </li>
          <li>
            <Link
              to="/delivery"
              className="transition-all text-sm p-2 h-full border-b border-black border-opacity-0 hover:border-opacity-100">
              Доставка
            </Link>
          </li>
          <li>
            <Link
              to="/warranty"
              className="transition-all text-sm p-2 h-full border-b border-black border-opacity-0 hover:border-opacity-100">
              Гарантия
            </Link>
          </li>
          <li>
            <Link
              to="/contacts"
              className="transition-all text-sm p-2 h-full border-b border-black border-opacity-0 hover:border-opacity-100">
              Контакты
            </Link>
          </li>
          <li>
            <div className="flex gap-4">
              <p className="transition text-sm font-semibold self-end p-2 h-full">
                +7 (999) 999-99-99
              </p>
              <p className="transition text-sm font-semibold self-end p-2 h-full">
                +7 (999) 999-99-99
              </p>
            </div>
          </li>
        </ul>
      </footer>
    </footer>
  );
}
