import { User } from "lucide-react";

import { Dialog, DialogTrigger } from "@shadcnUi/dialog";
import { Button } from "@shadcnUi/button";
import { AuthForm } from "@components/auth/auth-form";

export function ProfileButton({rounded}: {rounded?: boolean}) {
  return (
    <Dialog>
      <DialogTrigger>
        <Button variant="ghost" className={`h-full gap-4 ${rounded ? '' : 'rounded-none'}`}>
          Войти
          <User />
        </Button>
      </DialogTrigger>
      <AuthForm />
    </Dialog>
  );
}
