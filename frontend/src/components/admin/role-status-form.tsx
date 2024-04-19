import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Button } from "../ui/button";
import { Check } from "lucide-react";
import { userService } from "@/services/user.service";

const roleFormSchema = z.object({
  role: z
    .string()
});

const statuses = ["user", "admin"];

export function RoleStatusForm({ id, role }: { id: number; role: string }) {
  const form = useForm<z.infer<typeof roleFormSchema>>({
    resolver: zodResolver(roleFormSchema),
    defaultValues: { role: (statuses.indexOf(role) + 1).toString() },
  });
  const onSubmit = (data: z.infer<typeof roleFormSchema>) => {
    userService.updateUserRole(id, data.role).then((res) => {
      console.log(res);
    });
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2">
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите роль" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="1">Пользователь</SelectItem>
                  <SelectItem value="2">Админ</SelectItem>
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
