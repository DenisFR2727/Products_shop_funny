"use server";
export default async function isLogin(_prevState: any, formData: FormData) {
  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  console.log(data.email, data.password);
}
