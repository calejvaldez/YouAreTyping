import { ReactNode } from "react";
import "./global.css";

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <html>
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
