"use server";
import { postAddressOrder } from "@/lib/api/order-address";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { CartProduct } from "@/lib/features/products/cartSlice";
import { AddressDetails, AddressErrors } from "./types";
import errorsForm from "./errors";

export default async function addressCreate(
  _prevState: any,
  formData: FormData,
  orders: CartProduct[]
) {
  const orderId = Date.now() + Math.floor(Math.random() * 10000);

  const data = {
    orderId: String(orderId),
    title: formData.get("title") as string,
    name: formData.get("name") as string,
    lastName: formData.get("lastName") as string,
    address: formData.get("address") as string,
    country: formData.get("country") as string,
    code: formData.get("code") as string,
    email: formData.get("email") as string,
    phone: formData.get("phone") as string,
  };

  const errors = errorsForm(data);
  if (errors) {
    return errors;
  }

  await postAddressOrder({ ...data, orders });

  revalidatePath("/", "layout");
  redirect(`/thanks/${orderId}`);
}
