export type TUser = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  photo?: string;
  role: string;
  isDeleted?: boolean;
  __v?: number;
};
