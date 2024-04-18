import { Form, FormControl, FormField, FormItem } from "@shadcnUi/form";
import { AlertTriangle, Check, Loader2, PencilLine } from "lucide-react";
import { Input } from "@shadcnUi/input";
import { z } from "zod";
import { MutableRefObject, useRef, useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { imagesService } from "@/services/images.service";

// Images
const MAX_IMAGE_SIZE = 5242880; // 5 MB
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

const imageEditSchema = z.object({
  images: z
    .custom<FileList>((val) => val instanceof FileList, "Required")
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

export function ImageEdit({ id }: { id: number }) {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof imageEditSchema>>({
    resolver: zodResolver(imageEditSchema),
  });
  const onSubmit = (data: z.infer<typeof imageEditSchema>) => {
    console.log(data);
    startTransition(() => {
      imagesService.updateAllPhotos({ images: data.images, id: id.toString() }).then(() => {
        setError(undefined);
        setSuccess("Изображения обновлены");
      });
    });
  };
  const formRef: MutableRefObject<HTMLFormElement | null> = useRef(null);
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} ref={formRef}>
        <FormField
          control={form.control}
          name="images"
          render={({ field }) => {
            // Get current images value (always watched updated)
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { onChange, value, ...rest } = field;
            const images = form.watch("images");

            return (
              <FormItem className="flex flex-col justify-center items-center">
                {/* File Upload */}
                <FormControl>
                  <div className="grow">
                    <label htmlFor="images">
                      {isPending ? (
                        <Loader2 size={48} className="transition animate-spin" />
                      ) : success ? (
                        <Check size={48} className="transition text-secondary" />
                      ) : error ? (
                        <AlertTriangle size={48} className="transition text-primary" />
                      ) : (
                        <PencilLine className="transition text-primary" />
                      )}
                    </label>
                    <Input
                      type="file"
                      accept="image/*"
                      multiple={true}
                      disabled={isPending}
                      className="hidden"
                      id="images"
                      {...rest}
                      onChange={(event) => {
                        // Triggered when user uploaded a new file
                        // FileList is immutable, so we need to create a new one
                        const dataTransfer = new DataTransfer();

                        // Add old images
                        if (images) {
                          Array.from(images).forEach((image) => dataTransfer.items.add(image));
                        }

                        // Add newly uploaded images
                        Array.from(event.target.files!).forEach((image) =>
                          dataTransfer.items.add(image),
                        );

                        // Validate and update uploaded file
                        const newFiles = dataTransfer.files;
                        onChange(newFiles);
                        form.handleSubmit(onSubmit)();
                      }}
                    />
                  </div>
                </FormControl>
              </FormItem>
            );
          }}
        />
      </form>
    </Form>
  );
}
