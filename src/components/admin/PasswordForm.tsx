"use client";

import { Alert, Button, Input } from "antd";
import { useActionState } from "react";
import { changePassword } from "@/lib/admin/actions";

export default function PasswordForm() {
  const [state, action, pending] = useActionState(changePassword, {});
  return (
    <form action={action} className="admin-form">
      {state.error && <Alert type="error" showIcon title={state.error} />}
      {state.ok && <Alert type="success" showIcon title={state.ok} />}
      <label>New password (12 characters or more)<Input.Password name="password" autoComplete="new-password" required minLength={12} /></label>
      <label>Repeat new password<Input.Password name="confirm" autoComplete="new-password" required minLength={12} /></label>
      <Button type="primary" htmlType="submit" loading={pending}>Change password</Button>
    </form>
  );
}
