export interface CreateUserPayload {
   userId: string;
   username: string;
   email: string;
   phone: string;
   password: string;
   confirmPass?: string;
 }