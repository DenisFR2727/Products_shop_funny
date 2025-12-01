import { postAddressOrder } from "@/lib/api/order-address";
import { redirect } from "next/navigation";

export default async function addressCreate(prevState: any, formData: any) {
  const title = formData.get("title");
  const name = formData.get("name");
  const last_name = formData.get("last_name");
  const address = formData.get("address");
  const country = formData.get("country");
  const code = formData.get("code");
  console.log(`${title}`);
  let errors = [];

  await postAddressOrder({
    title,
    name,
    last_name,
    address,
    country,
    code,
  });

  redirect("/orders");
}
