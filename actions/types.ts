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
export type AddressErrors = Partial<Record<keyof AddressDetails, string>>;
