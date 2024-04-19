import { ChangeProfileForm } from "@/components/profile/change-profile-form";
import { useUserStore } from "@/components/stores/UserStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { orderService } from "@/services/order.service";
import { userService } from "@/services/user.service";
import { Await, createFileRoute, defer, Link, redirect, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";

export const Route = createFileRoute("/profile/")({
  beforeLoad: async () => {
    if (!localStorage.getItem("jwt")) {
      redirect({ to: "/" });
    }
  },
  loader: async () => {
    if (useUserStore.getState().name === "" && localStorage.getItem("jwt")) {
      const user = await userService.getUser();
      console.log(user);
      
      useUserStore.setState(user);
    }
    const orders = orderService.getOrders();
    return {
      orders: defer(orders),
      isAdmin: await userService.getRole(),
    };
  },
  component: Index,
});

const statuses = new Map([
  ["processing", "В обработке"],
  ["delivery", "Доставляется"],
  ["arrived", "Доставлен"],
]);

export function Index() {
  const { orders, isAdmin } = Route.useLoaderData();
  const user = useUserStore((state) => state);
  const navigate = useNavigate();
  const logOut = () => {
    userService.logout();
    navigate({ to: "/" });
  };
  return (
    <main className="w-full md:w-10/12 mt-6 flex flex-col gap-12 mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Профиль</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-zinc-500">Ваше имя: {user.name}</p>
          <p className="text-zinc-500">Ваша почта: {user.email}</p>
          {user.address && <p className="text-zinc-500">Ваш адрес: {user.address}</p>}
          <ChangeProfileForm />
          {isAdmin && (
            <Button className="w-fit" variant={"outline"}>
              <Link to="/admin">Войти в админ панель</Link>
            </Button>
          )}
        </CardContent>
        <CardFooter>
          <Button variant="destructive" onClick={() => logOut()}>
            Выйти
          </Button>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Ваши заказы</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<Loader2 className="w-6 h-6 animate-spin" />}>
            <Await promise={orders}>
              {(orders) => (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {orders.map((order, index) => (
                    <Card key={index} className="w-full flex flex-col justify-between">
                      <CardHeader>
                        <CardTitle>Заказ #{index}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {order.products.map((item) => (
                            <li key={item.id}>
                              <Link
                                to={`/products/$productId`}
                                params={{ productId: item.id.toString() }}>
                                <span className="font-semibold">{item.name}</span> -{" "}
                              </Link>
                              <span className="font-normal text-gray-500">{item.count}x</span>{" "}
                              <span className="font-semibold">{item.price}₽</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                      <CardFooter className="flex gap-4">
                        <p>Статус: </p>
                        <span
                          className={`px-2 py-1 ${
                            order.status === "Processing"
                              ? "bg-yellow-200 text-yellow-800"
                              : order.status === "Delivered"
                                ? "bg-green-200 text-green-800"
                                : "bg-gray-200 text-gray-800"
                          } rounded`}>
                          {statuses.get(order.status)}
                        </span>
                        <p>Итого: {order.total.toFixed(2)}₽</p>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </Await>
          </Suspense>
        </CardContent>
      </Card>
    </main>
  );
}
