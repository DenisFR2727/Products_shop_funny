import "./auth.scss";

export const metadata = {
  title: "Funny shop Auth",
  description: "Funny shop Authentication",
};

export default function AuthLayout({ children }: any) {
  return <section className="auth-layout">{children}</section>;
}
