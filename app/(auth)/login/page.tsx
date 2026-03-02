import dynamic from "next/dynamic";
import "../auth.scss";

const Login = dynamic(() => import("@/components/auth/login-page/login"), {
  ssr: false,
});

export default function LoginPage() {
  return <Login />;
}
