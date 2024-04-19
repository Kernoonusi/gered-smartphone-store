import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogHeader, DialogTitle } from "@shadcnUi/dialog";
import { Button } from "@shadcnUi/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@shadcnUi/form";
import { Input } from "@shadcnUi/input";
import { z } from "zod";
import { useState, useTransition } from "react";
import { HTTPError } from "ky";
import { Loader2 } from "lucide-react";
import { userService } from "@/services/user.service";
import { useAuthStore } from "./auth-form";
import { useToast } from "../ui/use-toast";

const forgetPassFormSchema = z.object({
  email: z.string().email().min(2).max(50).trim(),
  password: z.string().min(2).max(50).trim(),
  password2: z.string().min(2).max(50).trim(),
});

export function ForgetPassForm() {
  const [error, setError] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();;
  const form = useForm<z.infer<typeof forgetPassFormSchema>>({
    resolver: zodResolver(forgetPassFormSchema),
    defaultValues: {
      email: "",
      password: "",
      password2: "",
    },
  });
  const onSubmit = (values: z.infer<typeof forgetPassFormSchema>) => {
    console.log(values);
    startTransition(() => {
      try {
        if (values.password !== values.password2) {
          setError("Пароли не совпадают");
          return;
        }
        userService.updatePassword(values.password, values.email).then((res) => {
          console.log(res);
          toast({
            title: "Пароль успешно изменен",
          });
          setError(undefined);
          useAuthStore.getState().updateState("login");
        });
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
    <>
      <DialogHeader>
        <DialogTitle>Смена пароля</DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Email" {...field} />
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
          <FormField
            control={form.control}
            name="password2"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Повторите пароль</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="********" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {error && <p className="text-red-500">{error}</p>}
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Сменить пароль
          </Button>
        </form>
      </Form>
    </>
  );
}
