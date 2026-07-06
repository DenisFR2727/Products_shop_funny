import { ReduxProvider } from "../providers/redux-provider";

import "./marketing-layout.scss";

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
    <section className="marketing-layout">
      <ReduxProvider>{children}</ReduxProvider>
    </section>
  );
}
