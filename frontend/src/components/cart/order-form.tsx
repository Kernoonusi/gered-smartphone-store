import { zodResolver } from "@hookform/resolvers/zod";
import { DialogHeader, DialogTitle } from "@shadcnUi/dialog";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { useState, useTransition } from "react";
import { useUserStore } from "../stores/UserStore";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { orderFormSchema } from "@/schemas";
import { orderService } from "@/services/order.service";
import { ICartItem, IOrder } from "@/types";
import { HTTPError } from "ky";

export function OrderForm() {
  const [error, setError] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();
  const user = useUserStore((state) => state);
  const form = useForm<z.infer<typeof orderFormSchema>>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      address: user.address || "",
      paymentMethod: "",
      note: "",
    },
  });
  const onSubmit = (values: z.infer<typeof orderFormSchema>) => {
    startTransition(() => {
      const cart: ICartItem[] = user.cart || [];
      const order: IOrder = {
        address: values.address,
        note: values.note,
        products: cart.map((item) => ({ id: item.id, count: item.countBasket })),
      };
      console.log(order);
      orderService
        .createOrder(order)
        .then(() => {
          form.reset();
        })
        .catch((error) => {
          if (error instanceof HTTPError) {
            error.response.text().then((text) => {
              console.log(text);
            });
          } else {
            setError(error.message);
          }
        });
    });
  };
  return (
    <>
      <DialogHeader>
        <DialogTitle>Оформление заказа</DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Адрес</FormLabel>
                <FormControl>
                  <Input {...field} type="text" placeholder="Адрес" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="paymentMethod"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Способ оплаты</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    name="paymentMethod">
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Выберите способ оплаты" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="card">Картой при получении</SelectItem>
                      <SelectItem value="cash">Наличными при получении</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="note"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Комментарий</FormLabel>
                <FormControl>
                  <Input {...field} type="text" placeholder="Комментарий(необязательно)" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {error && <p className="text-red-500">{error}</p>}
          <Button onClick={() => form.handleSubmit(onSubmit)()} disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Оформить
          </Button>
        </form>
      </Form>
    </>
  );
}
