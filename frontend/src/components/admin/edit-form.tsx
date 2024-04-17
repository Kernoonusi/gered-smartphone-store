import { IProduct } from "@/types";
import { Dialog, DialogHeader, DialogTrigger, DialogContent, DialogTitle } from "@shadcnUi/dialog";
import { Input } from "@shadcnUi/input";
import { PencilLine } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@shadcnUi/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@shadcnUi/form";
import { Textarea } from "@shadcnUi/textarea";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const editProductSchema = z.object({
  id: z.number(),
  nameProduct: z.string().min(1, { message: "Название обязательно для заполнения" }),
  price: z
    .number({ invalid_type_error: "Цена обязательна для заполнения" })
    .min(1, { message: "Цена обязательна для заполнения" }),
  description: z.string().min(1, { message: "Описание обязательно для заполнения" }),
  ram: z
    .number({ invalid_type_error: "Объем ОЗУ обязателен для заполнения" })
    .min(1, { message: "Объем ОЗУ обязателен для заполнения" }),
  storage: z
    .number({ invalid_type_error: "Объем хранилища обязателен для заполнения" })
    .min(1, { message: "Объем хранилища обязателен для заполнения" }),
  size: z.string().min(1, { message: "Размер обязателен для заполнения" }),
  brand: z.string().min(1, { message: "Бренд обязателен для заполнения" }),
  soc: z.string().min(1, { message: "SOC обязателен для заполнения" }),
  weight: z
    .number({ invalid_type_error: "Вес обязателен для заполнения" })
    .min(1, { message: "Вес обязателен для заполнения" }),
  releaseYear: z
    .number({ invalid_type_error: "Год выпуска обязателен для заполнения" })
    .min(1, { message: "Год выпуска обязателен для заполнения" }),
  count: z.number().min(1, { message: "Количество обязательно для заполнения" }),
});

export function EditForm({ product }: { product: IProduct }) {
  const editForm = useForm<z.infer<typeof editProductSchema>>({
    resolver: zodResolver(editProductSchema),
  });
  function onEditFormSubmit(data: z.infer<typeof editProductSchema>) {
    console.log(data);
  }
  return (
    <Dialog>
      <DialogTrigger>
        <Button size={"icon"}>
          <PencilLine />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Редактирование</DialogTitle>
        </DialogHeader>
        <Form {...editForm}>
          <form
            onSubmit={editForm.handleSubmit(onEditFormSubmit)}
            className="grid grid-cols-3 gap-4">
            <FormField
              control={editForm.control}
              name="id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Id</FormLabel>
                  <FormControl>
                    <Input {...field} disabled defaultValue={product.id} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={editForm.control}
              name="nameProduct"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Название</FormLabel>
                  <FormControl>
                    <Input {...field} defaultValue={product.nameProduct} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={editForm.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Цена</FormLabel>
                  <FormControl>
                    <Input {...field} defaultValue={product.price} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={editForm.control}
              name="ram"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Оперативная память</FormLabel>
                  <FormControl>
                    <Input {...field} defaultValue={product.ram} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={editForm.control}
              name="storage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Встроенная память</FormLabel>
                  <FormControl>
                    <Input {...field} defaultValue={product.storage} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={editForm.control}
              name="size"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Диагональ экрана</FormLabel>
                  <FormControl>
                    <Input {...field} defaultValue={product.size} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={editForm.control}
              name="soc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SOC</FormLabel>
                  <FormControl>
                    <Input {...field} defaultValue={product.soc} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={editForm.control}
              name="brand"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Бренд</FormLabel>
                  <FormControl>
                    <Input {...field} defaultValue={product.brand} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={editForm.control}
              name="releaseYear"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Год выпуска</FormLabel>
                  <FormControl>
                    <Input {...field} defaultValue={product.releaseYear} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={editForm.control}
              name="weight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Вес</FormLabel>
                  <FormControl>
                    <Input {...field} defaultValue={product.weight} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={editForm.control}
              name="count"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Количество</FormLabel>
                  <FormControl>
                    <Input {...field} defaultValue={product.count} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={editForm.control}
              name="description"
              render={({ field }) => (
                <FormItem className="col-span-3">
                  <FormLabel>Описание</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={6} defaultValue={product.description} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="col-span-3 mx-auto w-fit">
              Сохранить
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
