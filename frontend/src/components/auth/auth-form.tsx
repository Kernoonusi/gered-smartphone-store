// import { useState } from "react";
import { create } from 'zustand'

import { DialogContent } from "@shadcnUi/dialog";
import { LoginForm } from "@components/auth/login-form";
import { RegForm } from "@components/auth/reg-form";
import { ForgetPassForm } from "@components/auth/forget-pass-form";

const authStates = new Map<string, JSX.Element>([
  ["login", <LoginForm key={"login"} />],
  ["reg", <RegForm key={"reg"} />],
  ["forgetPass", <ForgetPassForm key={"forgetPass"} />],
]);

type State = {
  authState: string
}

type Action = {
  updateState: (authState: State['authState']) => void
}

export const useAuthStore = create<State & Action>((set) => ({
  authState: "login",
  updateState: (newState: string) => set(() => ({ authState: newState })),
}))

export function AuthForm() {
  const authState = useAuthStore((state) => state.authState);
  const updateState = useAuthStore((state) => state.updateState);
  return (
    <DialogContent>
      {authStates.get(authState)}
      <p>
        {useAuthStore.getState().authState === "reg" ? (
          <>
            У вас уже есть аккаунт?{" "}
            <button className="inline underline" onClick={() => updateState("login")}>
              Войдите!
            </button>
          </>
        ) : (
          <>
            У вас нет аккаунта?{" "}
            <button className="inline underline" onClick={() => updateState("reg")}>
              Зарегистрируйтесь!
            </button>
          </>
        )}
      </p>
    </DialogContent>
  );
}
