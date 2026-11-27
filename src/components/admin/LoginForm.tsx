"use client";

import { Alert, Button, Input } from "antd";
import { useActionState } from "react";
import { signIn } from "@/lib/admin/actions";

export default function LoginForm() {
  const [state, action, pending] = useActionState(signIn, {});
  return (
    <form action={action} className="admin-form">
      {state.error && <Alert type="error" showIcon title={state.error} />}
      <label>Email<Input name="email" type="email" autoComplete="username" required /></label>
      <label>Password<Input.Password name="password" autoComplete="current-password" required /></label>
      <Button type="primary" htmlType="submit" loading={pending}>Sign in</Button>
    </form>
  );
}
