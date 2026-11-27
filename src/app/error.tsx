"use client";

import { Button } from "antd";

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="page-intro"><div className="container">
      <h1>Something went wrong</h1>
      <p>This page could not load.</p>
      <Button type="primary" onClick={reset}>Try again</Button>
    </div></div>
  );
}
