import Providers from "@/utils/provider";
import React from "react";
import "./globals.css";

export const metadata = {
  title: "Todo App",
  description: "Built by Lukas Hall",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
