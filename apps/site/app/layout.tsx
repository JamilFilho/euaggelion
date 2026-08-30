import type { ReactNode } from "react";
import "./global.css";

export const metadata = {
  title: "Projeto Euaggelion",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="">
      <body>{children}</body>
    </html>
  );
}
