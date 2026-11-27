"use client";

import { ConfigProvider } from "antd";

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#17708C",
          colorLink: "#17708C",
          colorText: "#0C3441",
          colorTextHeading: "#0C3441",
          fontFamily: "'Inter Variable', 'Noto Sans Devanagari', system-ui, sans-serif",
          fontSize: 16,
          borderRadius: 8,
          controlHeight: 40,
          controlHeightLG: 48,
        },
        components: {
          Button: {
            // Gold buttons with dark text, for contrast.
            colorPrimary: "#FED859",
            colorPrimaryHover: "#FCE49E",
            colorPrimaryActive: "#F2C832",
            primaryColor: "#0C3441",
            fontWeight: 600,
            primaryShadow: "none",
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}
