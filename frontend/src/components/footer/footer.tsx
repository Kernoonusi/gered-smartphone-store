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
    <footer className="w-full mt-20 md:w-10/12 flex flex-col gap-12 mx-auto">
      <article className="flex  px-12 py-6 bg-fuchsia-900 md:gap-4">
        {adv.map(({ title, description, icon: Icon }, index) => (
          <div className="flex flex-[1_1_0] flex-col gap-4" key={index}>
            <Icon size={48} color="white" />
            <h2 className="text-3xl text-white">{title}</h2>
            <p className="text-white">{description}</p>
          </div>
        ))}
      </article>
    </footer>
  );
}
