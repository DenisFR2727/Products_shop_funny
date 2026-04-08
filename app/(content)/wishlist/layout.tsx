export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      {children}
      <div id="dialog-wishlist"></div>
    </div>
  );
}
// git not connected
