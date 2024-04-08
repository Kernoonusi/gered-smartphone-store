import { User } from "lucide-react";

import { Dialog, DialogTrigger } from "@shadcnUi/dialog";
import { Button } from "@shadcnUi/button";
import { AuthForm } from "@components/auth/auth-form";
import { useUserStore } from "@components/stores/UserStore";

export function ProfileButton({ rounded }: { rounded?: boolean }) {
  const user = useUserStore((state) => state.user);
  return (
    <>
      {user.email !== "" ? (
        <Button variant="ghost" className={`h-full gap-4 ${rounded ? "" : "rounded-none"}`}>
          {user.name}
          <User />
        </Button>
      ) : (
        <Dialog>
          <DialogTrigger>
            <Button variant="ghost" className={`h-full gap-4 ${rounded ? "" : "rounded-none"}`}>
              Войти
              <User />
            </Button>
          </DialogTrigger>
          <AuthForm />
        </Dialog>
      )}
    </>
  );
}
