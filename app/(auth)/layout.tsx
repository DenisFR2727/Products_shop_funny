import { Suspense } from "react";
import { ThemeContextProvider } from "@/context/themeContext";
import "./auth.scss";

export const metadata = {
  title: "Funny shop Auth",
  description: "Funny shop Authentication",
};

export default function AuthLayout({ children }: any) {
  return (
    <ThemeContextProvider>
      <section className="auth-layout">
        <Suspense fallback={null}>{children}</Suspense>
      </section>
    </ThemeContextProvider>
  );
}
