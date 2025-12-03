import { AddressDetails } from "./address";

export default function errorsForm(data: AddressDetails) {
  let errors = {
    title: "",
    name: "",
    lastName: "",
    address: "",
    country: "",
    code: "",
  };

  if (!data.title || data.title.trim().length === 0) {
    errors.title = "Title is required";
  } else if (!/[a-zA-Zа-яА-Я]+$/g.test(data.title.trim())) {
    errors.title = "Title must only words!";
  }

  if (!data.name || data.name.trim().length === 0) {
    errors.name = "Name is required";
  } else if (!/[a-zA-Zа-яА-Я]+$/g.test(data.name.trim())) {
    errors.name = "Name must only words!";
  }

  if (!data.lastName || data.lastName.trim().length === 0) {
    errors.lastName = "Last name is required";
  } else if (!/[a-zA-Zа-яА-Я]+$/g.test(data.lastName.trim())) {
    errors.lastName = "Last Name must only words!";
  }

  if (!data.address || data.address.trim().length === 0) {
    errors.address = "Last name is required";
  }

  if (!data.country || data.country.trim().length === 0) {
    errors.country = "Country is required";
  } else if (!/[a-zA-Zа-яА-Я]+$/g.test(data.country.trim())) {
    errors.country = "Country must only words!";
  }

  if (!data.code) {
    errors.code = "Code is required";
  }
  if (!/^\d+$/.test(String(data.code))) {
    errors.code = "Code must contain only digits";
  }
  const hasErrors = Object.values(errors).some((err) => err !== "");

  return hasErrors ? { errors } : null;
}
