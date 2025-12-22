import { ReduxProvider } from "../providers/redux-provider";

export const metadata = {
  title: "We are changing the way people shop",
  description: "people shop.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <ReduxProvider>{children}</ReduxProvider>
    </section>
  );
}
