// app/layout.tsx
export default function RootLayout({ children }: any) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body>{children}</body>
    </html>
  );
}
