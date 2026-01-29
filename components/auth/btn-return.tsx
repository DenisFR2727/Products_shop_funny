"use client";
import { useRouter } from "next/navigation";
import { ImExit } from "react-icons/im";

export default function ButtonReturn() {
  const router = useRouter();
  return (
    <div className="login__btn-return" onClick={() => router.push("/products")}>
      <ImExit />
    </div>
  );
}
