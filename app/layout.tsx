import { AppThemeProvider } from "./providers/app-theme-provider";

export default function RootLayout({ children }: any) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body>
        <AppThemeProvider>{children}</AppThemeProvider>
      </body>
    </html>
  );
}
