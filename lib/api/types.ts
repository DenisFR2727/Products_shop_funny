export interface CreateUserPayload {
  userId: string;
  username: string;
  email: string;
  phone: string;
  password: string;
  confirmPass?: string;
}
export type UserByEmail = {
  id?: string;
  userId?: string;
  username: string;
  email: string;
  password: string;
  phone?: string;
  image?: string;
  avatar?: string;
  logo?: string;
};
