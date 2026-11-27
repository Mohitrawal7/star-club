"use client";

import { Button, type ButtonProps } from "antd";
import { useRouter } from "next/navigation";

/** An Ant Design button that is a real link and navigates without a full page reload. */
export default function LinkButton({ href, ...props }: ButtonProps & { href: string }) {
  const router = useRouter();
  return (
    <Button
      {...props}
      href={href}
      onClick={(e) => {
        if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        router.push(href);
      }}
    />
  );
}
