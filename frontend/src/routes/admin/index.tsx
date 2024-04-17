import { AddForm } from "@/components/admin/add-form";
import { EditForm } from "@/components/admin/edit-form";
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
import { productsService } from "@/services/products.service";
import { Await, createFileRoute, defer, redirect } from "@tanstack/react-router";
import { Loader2, Trash } from "lucide-react";
import { Suspense } from "react";

export const Route = createFileRoute("/admin/")({
  beforeLoad: async () => {
    if (!localStorage.getItem("jwt")) {
      redirect({ to: "/" });
    }
  },
  loader: async () => {
    const products = productsService.getProducts(20);
    return { products: defer(products) };
  },
  component: Index,
});

export function Index() {
  const { products } = Route.useLoaderData();
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
                          <Button variant="destructive" size={"icon"}>
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
      </Tabs>
    </main>
  );
}
