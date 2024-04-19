import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { orderService } from "@/services/order.service";
import { Button } from "../ui/button";
import { Check } from "lucide-react";

const orderFormSchema = z.object({
  status: z
    .string()
});

const statuses = ["processing", "delivery", "arrived"];

export function OrderStatusForm({ id, status }: { id: number; status: string }) {
  const form = useForm<z.infer<typeof orderFormSchema>>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: { status: (statuses.indexOf(status) + 1).toString() },
  });
  const onSubmit = (data: z.infer<typeof orderFormSchema>) => {
    orderService.updateOrderStatus(id, data.status).then((res) => {
      console.log(res);
    });
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2">
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите статус" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="1">Обрабатывается</SelectItem>
                  <SelectItem value="2">Доставляется</SelectItem>
                  <SelectItem value="3">Прибыл</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        <Button type="submit" size={"icon"}>
          <Check />
        </Button>
      </form>
    </Form>
  );
}
