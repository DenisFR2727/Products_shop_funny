import "@/styles/globals.css";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const ProgressHandler = dynamic(
  () => import("@/components/products/modal/progress/ProgressHandler"),
  { ssr: false }
);

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
