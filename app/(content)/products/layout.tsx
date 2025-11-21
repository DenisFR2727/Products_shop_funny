import "@/styles/globals.css";
import ProgressHandler from "@/components/products/modal/progress/ProgressHandler";

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <div>
      <ProgressHandler />
      {children}
      {modal}
    </div>
  );
}
