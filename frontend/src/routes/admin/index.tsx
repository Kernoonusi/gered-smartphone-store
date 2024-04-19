import { AddForm } from "@/components/admin/add-form";
import { EditForm } from "@/components/admin/edit-form";
import { OrderStatusForm } from "@/components/admin/order-status-form";
import { RoleStatusForm } from "@/components/admin/role-status-form";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { orderService } from "@/services/order.service";
import { productsService } from "@/services/products.service";
import { userService } from "@/services/user.service";
import { Await, createFileRoute, defer, redirect, useRouter } from "@tanstack/react-router";
import { Loader2, Trash } from "lucide-react";
import React, { Suspense } from "react";

export const Route = createFileRoute("/admin/")({
  beforeLoad: async () => {
    if (!localStorage.getItem("jwt")) {
      redirect({ to: "/" });
    }
  },
  loader: async () => {
    const products = productsService.getProducts(2000);
    const orders = orderService.getAllOrders();
    const users = userService.getAllUsers();
    return { products: defer(products), orders: defer(orders), users: defer(users) };
  },
  component: Index,
});

export function Index() {
  const { products, orders, users } = Route.useLoaderData();
  const router = useRouter();
  const onDeleteProduct = (id: number) => {
    productsService.deleteProduct(id.toString()).then(() => {
      console.log("deleted");
      router.invalidate();
    });
  };
  const onDeleteOrder = (id: number) => {
    orderService.deleteOrder(id).then(() => {
      console.log("deleted");
      router.invalidate();
    });
  };
  const onDeleteUser = (id: number) => {
    userService.deleteUser(id).then(() => {
      console.log("deleted");
      router.invalidate();
    });
  };
  return (
    <main className="w-full md:w-10/12 mt-6 flex flex-col gap-12 mx-auto">
      <Tabs defaultValue="products">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="products">Смартфоны</TabsTrigger>
          <TabsTrigger value="orders">Заказы</TabsTrigger>
          <TabsTrigger value="users">Пользователи</TabsTrigger>
        </TabsList>
        <TabsContent value="products">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Id</TableHead>
                <TableHead>Название</TableHead>
                <TableHead>Цена</TableHead>
                <TableHead>Описание</TableHead>
                <TableHead>Кол-во оперативной памяти</TableHead>
                <TableHead>Кол-во встроенной памяти</TableHead>
                <TableHead>SOC</TableHead>
                <TableHead>Вес</TableHead>
                <TableHead>Диагональ экрана</TableHead>
                <TableHead>Бренд</TableHead>
                <TableHead>Год выпуска</TableHead>
                <TableHead>Количество</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <Suspense fallback={<Loader2 className="w-4 h-4 animate-spin" />}>
                <Await promise={products}>
                  {(data) => {
                    return data.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>{product.id}</TableCell>
                        <TableCell>{product.nameProduct}</TableCell>
                        <TableCell>{product.price}</TableCell>
                        <TableCell>{product.description}</TableCell>
                        <TableCell>{product.ram}</TableCell>
                        <TableCell>{product.storage}</TableCell>
                        <TableCell>{product.soc}</TableCell>
                        <TableCell>{product.weight}</TableCell>
                        <TableCell>{product.size}</TableCell>
                        <TableCell>{product.brand}</TableCell>
                        <TableCell>{product.releaseYear}</TableCell>
                        <TableCell>{product.count}</TableCell>
                        <TableCell className="flex gap-2">
                          <Button
                            variant="destructive"
                            onClick={() => onDeleteProduct(product.id)}
                            size={"icon"}>
                            <Trash />
                          </Button>
                          <EditForm product={product} />
                        </TableCell>
                      </TableRow>
                    ));
                  }}
                </Await>
              </Suspense>
            </TableBody>
          </Table>
          <div>
            <AddForm />
          </div>
        </TabsContent>
        <TabsContent value="orders">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Id</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Имя</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Комментарии</TableHead>
                <TableHead>Товары</TableHead>
                <TableHead>Количество</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <Suspense fallback={<Loader2 className="w-4 h-4 animate-spin" />}>
                <Await promise={orders}>
                  {(data) => {
                    return data.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>{order.id}</TableCell>
                        <TableCell>{order.email}</TableCell>
                        <TableCell>{order.name}</TableCell>
                        <TableCell>
                          <OrderStatusForm id={order.id} status={order.status} />
                        </TableCell>
                        <TableCell>{order.note}</TableCell>
                        <TableCell>
                          {order.nameProducts.split(";").map((product, index) => (
                            <React.Fragment key={index}>
                              {index > 0 ? <br /> : null}
                              {product}
                            </React.Fragment>
                          ))}
                        </TableCell>
                        <TableCell>
                          {order.quantities.split(";").map((count, index) => (
                            <React.Fragment key={index}>
                              {index > 0 ? <br /> : null}
                              {count}
                            </React.Fragment>
                          ))}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="destructive"
                            onClick={() => onDeleteOrder(order.id)}
                            size={"icon"}>
                            <Trash />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ));
                  }}
                </Await>
              </Suspense>
            </TableBody>
          </Table>
        </TabsContent>
        <TabsContent value="users">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Id</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Имя</TableHead>
                <TableHead>Адрес</TableHead>
                <TableHead>Роль</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <Suspense fallback={<Loader2 className="w-4 h-4 animate-spin" />}>
                <Await promise={users}>
                  {(data) => {
                    return data.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.id}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.address}</TableCell>
                        <TableCell>
                          <RoleStatusForm id={user.id} role={user.role} />
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="destructive"
                            onClick={() => onDeleteUser(user.id)}
                            size={"icon"}>
                            <Trash />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ));
                  }}
                </Await>
              </Suspense>
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </main>
  );
}
