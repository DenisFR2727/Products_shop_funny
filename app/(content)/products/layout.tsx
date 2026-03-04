import "@/styles/globals.css";
import { Suspense } from "react";
import ProgressHandler from "@/components/products/modal/progress/ProgressHandlerDynamic";

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <div>
      <Suspense fallback={null}>
        <ProgressHandler />
      </Suspense>
      {children}
      {modal}
    </div>
  );
}
