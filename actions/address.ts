"use server";
import { postAddressOrder } from "@/lib/api/order-address";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import errorsForm from "./errors";

export interface AddressDetails {
  title: string;
  name: string;
  lastName: string;
  address: string;
  country: string;
  code: number;
}

export default async function addressCreate(
  prevState: any,
  formData: FormData
) {
  const data: AddressDetails = {
    title: formData.get("title") as string,
    name: formData.get("name") as string,
    lastName: formData.get("lastName") as string,
    address: formData.get("address") as string,
    country: formData.get("country") as string,
    code: Number(formData.get("code")),
  };
  const errors = errorsForm(data);
  if (errors) {
    return errors;
  }

  await postAddressOrder(data);

  revalidatePath("/", "layout");
  redirect("/products");
}
