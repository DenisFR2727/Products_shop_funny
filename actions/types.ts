export interface AddressDetails {
  orderId: string;
  title: string;
  name: string;
  lastName: string;
  address: string;
  country: string;
  code: string;
  email: string;
  phone: string;
  phonePrefix?: string;
  errors?: AddressErrors;
}
export interface UserFields {
  userId: string;
  username: string;
  email: string;
  phone: string;
  password: string;
  confirmPass: string;
}
// export type AddressErrors = Partial<Record<keyof AddressDetails, string>>;
export type FormErrors<T> = Partial<Record<keyof T, string>>;

// AddressErrors без рекурсії
export type AddressErrors = FormErrors<AddressDetails>;
export type UserErrors = FormErrors<UserFields>;
