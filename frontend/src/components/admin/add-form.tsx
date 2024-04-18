import { Dialog, DialogHeader, DialogTrigger, DialogContent, DialogTitle } from "@shadcnUi/dialog";
import { Input } from "@shadcnUi/input";
import { useForm } from "react-hook-form";
import { Button } from "@shadcnUi/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@shadcnUi/form";
import { Textarea } from "@shadcnUi/textarea";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus } from "lucide-react";
import { useTransition } from "react";
import { productsService } from "@/services/products.service";
import { HTTPError } from "ky";

// function checkFileType(file: File) {
//   if (file?.name) {
//     const fileType = file.name.split(".").pop();
//     if (fileType === ".jpg" || fileType === ".png") return true;
//   }
//   return false;
// }

// Images
const MAX_IMAGE_SIZE = 5242880; // 5 MB
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

export const addProductSchema = z.object({
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
  images: z
    .custom<FileList>((val) => val instanceof FileList, "Required")
    .refine((files) => files.length > 0, `Нужно выбрать хотя бы 7 изображение`)
    .refine((files) => files.length == 7, `Нужно выбрать 7 изображений`)
    .refine(
      (files) => Array.from(files).every((file) => file.size <= MAX_IMAGE_SIZE),
      `Each file size should be less than 5 MB.`,
    )
    .refine(
      (files) => Array.from(files).every((file) => ALLOWED_IMAGE_TYPES.includes(file.type)),
      "Only these types are allowed .jpg, .jpeg, .png and .webp",
    ),
});

export function AddForm() {
  const [isPending, startTransition] = useTransition();
  const addForm = useForm<z.infer<typeof addProductSchema>>({
    resolver: zodResolver(addProductSchema),
    defaultValues: {
      id: 0,
      nameProduct: "",
      price: 0,
      description: "",
      ram: 0,
      storage: 0,
      size: 0,
      brand: "",
      soc: "",
      weight: 0,
      releaseYear: 0,
      count: 0,
    },
  });
  const onAddFormSubmit = (values: z.infer<typeof addProductSchema>) => {
    console.log(values);
    startTransition(() => {
      try {
        productsService.addProduct(values).then((res) => console.log(res));
      } catch (error) {
        if (error instanceof HTTPError) {
          error.response.text().then((text) => {
            console.log(text);
          });
        }
      }
    });
  };
  return (
    <Dialog>
      <DialogTrigger>
        <Button size="icon">
          <Plus />
        </Button>
      </DialogTrigger>
      <DialogContent className="lg:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Добавить</DialogTitle>
        </DialogHeader>
        <Form {...addForm}>
          <form
            onSubmit={addForm.handleSubmit(onAddFormSubmit)}
            encType="multipart/form-data"
            className="grid grid-cols-4 gap-4">
            <FormField
              control={addForm.control}
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
              control={addForm.control}
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
              control={addForm.control}
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
              control={addForm.control}
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
              control={addForm.control}
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
              control={addForm.control}
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
              control={addForm.control}
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
              control={addForm.control}
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
              control={addForm.control}
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
              control={addForm.control}
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
            <FormField
              control={addForm.control}
              name="images"
              render={({ field }) => {
                // Get current images value (always watched updated)
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { onChange, value, ...rest } = field;
                const images = addForm.watch("images");

                return (
                  <FormItem>
                    <FormLabel>Images</FormLabel>
                    {/* File Upload */}
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        multiple={true}
                        disabled={addForm.formState.isSubmitting}
                        {...rest}
                        onChange={(event) => {
                          // Triggered when user uploaded a new file
                          // FileList is immutable, so we need to create a new one
                          const dataTransfer = new DataTransfer();

                          // Add old images
                          if (images) {
                            Array.from(images).forEach((image) =>
                              dataTransfer.items.add(image),
                            );
                          }

                          // Add newly uploaded images
                          Array.from(event.target.files!).forEach((image) =>
                            dataTransfer.items.add(image),
                          );

                          // Validate and update uploaded file
                          const newFiles = dataTransfer.files;
                          onChange(newFiles);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={addForm.control}
              name="description"
              render={({ field }) => (
                <FormItem className="col-span-4">
                  <FormLabel>Описание</FormLabel>
                  <FormControl>
                    <Textarea rows={6} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isPending} className="col-span-4 mx-auto w-fit">
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Добавить
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
