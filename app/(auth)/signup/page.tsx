import dynamic from "next/dynamic";

const SignUp = dynamic(() => import("@/components/auth/signup-page/signup"), {
  ssr: false,
});

export default function SignUpPage() {
  return <SignUp />;
}
