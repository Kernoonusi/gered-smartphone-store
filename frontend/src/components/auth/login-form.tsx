import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState, useTransition } from "react";
import ky, { HTTPError } from "ky";
import { Loader2 } from "lucide-react";

import { DialogHeader, DialogTitle } from "@shadcnUi/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@shadcnUi/form";
import { Button } from "@shadcnUi/button";
import { Input } from "@shadcnUi/input";
import { useAuthStore } from "@components/auth/auth-form";
import { useUserStore } from "@components/stores/UserStore";
import { useToast } from "@shadcnUi/use-toast";

const formSchema = z.object({
  email: z
    .string()
    .min(2, { message: "Минимум 2 символа" })
    .max(50, { message: "Максимум 50 символов" }),
  password: z
    .string()
    .min(2, { message: "Минимум 8 символов" })
    .max(50, { message: "Максимум 50 символов" }),
});

export function LoginForm() {
  const [error, setError] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { toast } = useToast();
  const updateAuthState = useAuthStore((state) => state.updateState);
  const setUser = useUserStore((state) => state.setUser);
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    startTransition(() => {
      ky.post("http://gered-store-back.lndo.site/users/login", {
        json: values,
      })
        .json<{ message?: string; jwt?: string; error?: string }>()
        .then((response: { message?: string; jwt?: string; error?: string }) => {
          if (response.jwt) {
            localStorage.setItem("jwt", response.jwt);
          }
          if (response.message) {
            setUser();
            toast({
              title: "Успешный вход",
              description: response.message,
            });
            setError(undefined);
          }
          if (response.error) {
            setError(response.error);
          }
        })
        .catch((error) => {
          if (typeof error !== "undefined") {
            if (error instanceof HTTPError) {
              error.response.json().then((data: { error?: string }) => setError(data.error));
            } else {
              console.log(error);
            }
          }
        });
    });
  }
  return (
    <>
      <DialogHeader>
        <DialogTitle>Вход</DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                <FormDescription>
                  <button
                    className="cursor-pointer hover:underline"
                    type="button"
                    onClick={() => updateAuthState("forgetPass")}>
                    Забыли пароль?
                  </button>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {error && <p className="text-red-500">{error}</p>}
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Войти
          </Button>
        </form>
      </Form>
    </>
  );
}
