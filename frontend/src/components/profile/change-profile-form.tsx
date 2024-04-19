import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@shadcnUi/dialog";
import { Button } from "@shadcnUi/button";
import { useUserStore } from "../stores/UserStore";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { userService } from "@/services/user.service";
import { HTTPError } from "ky";

const userEditForm = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  address: z.string().max(50).optional(),
});
export function ChangeProfileForm() {
  const user = useUserStore((state) => state);
  const [error, setError] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof userEditForm>>({
    resolver: zodResolver(userEditForm),
    defaultValues: {
      name: user.name,
      email: user.email,
      address: user.address,
    },
  });
  const onSubmit = (data: z.infer<typeof userEditForm>) => {
    console.log(data);
    startTransition(() => {
      userService
        .updateUser(data.name, data.email, data.address)
        .then((response) => {
          console.log(response);
          setError(undefined);
          useUserStore.setState({ name: data.name, email: data.email, address: data.address });
        })
        .catch((error: HTTPError) => {
          error.response.text().then((text) => {
            setError(text);
          });
        });
    });
  };
  return (
    <Dialog>
      <DialogTrigger className="w-fit">
        <Button>Изменить профиль</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Изменение профиля</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Имя</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Имя" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Электронная почта</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="myemail@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Адрес</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Адрес" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {error && <p className="text-red-500">{error}</p>}
            <Button disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Сохранить
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
