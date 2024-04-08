import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import ky from "ky";
import { Loader2 } from "lucide-react";
import { useState, useTransition } from "react";
import { useNavigate } from "@tanstack/react-router";

import { DialogClose, DialogFooter, DialogHeader, DialogTitle } from "@shadcnUi/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@shadcnUi/form";
import { Button } from "@shadcnUi/button";
import { Input } from "@shadcnUi/input";

const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Минимум 2 символа" })
    .max(50, { message: "Максимум 50 символов" }),
  email: z
    .string()
    .min(2, { message: "Минимум 2 символа" })
    .max(50, { message: "Максимум 50 символов" }),
  password: z
    .string()
    .min(2, { message: "Минимум 8 символов" })
    .max(50, { message: "Максимум 50 символов" }),
});

export function RegForm() {
  const navigate = useNavigate({ from: "/" });
  const [error, setError] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    startTransition(() => {
      console.log(values);
      ky.post("http://gered-store-back.lndo.site/users", {
        json: values,
      })
        .json<{ message?: string; jwt?: string; error?: string }>()
        .then((response: { message?: string; jwt?: string; error?: string }) => {
          if (response.jwt) {
            localStorage.setItem("jwt", response.jwt);
          }
          if (response.message) {
            navigate({ to: "/cart" });
          }
          if (response.error) {
            setError(response.error);
          }
        });
    });
  };
  return (
    <>
      <DialogHeader>
        <DialogTitle>Регистрация</DialogTitle>
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
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Пароль</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="********" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {error && <p className="text-red-500">{error}</p>}
        </form>
      </Form>
      <DialogFooter className="justify-center sm:justify-center">
        <DialogClose>
          <Button onClick={() => form.handleSubmit(onSubmit)()} disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Зарегистрироваться
          </Button>
        </DialogClose>
      </DialogFooter>
    </>
  );
}
