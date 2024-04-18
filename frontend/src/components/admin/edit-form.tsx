import { IProduct } from "@/types";
import { Dialog, DialogHeader, DialogTrigger, DialogContent, DialogTitle } from "@shadcnUi/dialog";
import { Input } from "@shadcnUi/input";
import { Loader2, PencilLine } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@shadcnUi/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@shadcnUi/form";
import { Textarea } from "@shadcnUi/textarea";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { imagesService } from "@/services/images.service";
import { ImageEdit } from "./image-edit";
import { productsService } from "@/services/products.service";

export const editProductSchema = z.object({
  id: z.number(),
  nameProduct: z.string().min(1, { message: "Название обязательно для заполнения" }),
  price: z.coerce
    .number({ invalid_type_error: "Цена обязательна для заполнения" })
    .min(1, { message: "Цена обязательна для заполнения" }),
  description: z.string().min(1, { message: "Описание обязательно для заполнения" }),
  ram: z.coerce
    .number({ invalid_type_error: "Объем ОЗУ обязателен для заполнения" })
    .min(1, { message: "Объем ОЗУ обязателен для заполнения" }),
  storage: z.coerce
    .number({ invalid_type_error: "Объем хранилища обязателен для заполнения" })
    .min(1, { message: "Объем хранилища обязателен для заполнения" }),
  size: z.coerce.number().min(1, { message: "Размер обязателен для заполнения" }),
  brand: z.string().min(1, { message: "Бренд обязателен для заполнения" }),
  soc: z.string().min(1, { message: "SOC обязателен для заполнения" }),
  weight: z.coerce
    .number({ invalid_type_error: "Вес обязателен для заполнения" })
    .min(1, { message: "Вес обязателен для заполнения" }),
  releaseYear: z.coerce
    .number({ invalid_type_error: "Год выпуска обязателен для заполнения" })
    .min(1, { message: "Год выпуска обязателен для заполнения" }),
  count: z.coerce.number().min(1, { message: "Количество обязательно для заполнения" }),
});

export function EditForm({ product }: { product: IProduct }) {
  const [isPending, startTransition] = useTransition();
  const photos = imagesService.getAllSmartPhoneImages(product);
  const editForm = useForm<z.infer<typeof editProductSchema>>({
    resolver: zodResolver(editProductSchema),
    defaultValues: {
      id: product.id,
      nameProduct: product.nameProduct,
      price: product.price,
      description: product.description,
      ram: product.ram,
      storage: product.storage,
      size: +product.size,
      brand: product.brand,
      soc: product.soc,
      weight: product.weight,
      releaseYear: product.releaseYear,
      count: product.count,
    },
  });
  function onEditFormSubmit(data: z.infer<typeof editProductSchema>) {
    startTransition(() => {
      productsService.updateProduct(data).then((res) => {
        console.log(res);
      });
    });
  }
  return (
    <Dialog>
      <DialogTrigger>
        <Button size={"icon"}>
          <PencilLine />
        </Button>
      </DialogTrigger>
      <DialogContent className="lg:max-w-3xl">
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
                    <Input {...field} />
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
                    <Input type="number" min={1} step="any" {...field} />
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
                    <Input type="number" min={2} step={2} max={24} {...field} />
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
                    <Input type="number" min={64} step={64} max={2048} {...field} />
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
                    <Input type="number" min={5} step={0.1} max={7} {...field} />
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
                    <Input {...field} />
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
                    <Input {...field} />
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
                    <Input {...field} />
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
                    <Input type="number" {...field} />
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
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="col-span-3 grid grid-cols-7 gap-4">
              {photos.map((photo, index) => (
                <img src={photo} key={index} alt="" />
              ))}
              <div className="col-span-7 justify-center flex gap-4">
                <ImageEdit id={product.id} />
              </div>
            </div>
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
            <Button type="submit" disabled={isPending} className="col-span-3 mx-auto w-fit">
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Сохранить
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
