export type User = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: "seller" | "user";
  brandName: string;
  bio?: string;
  phone_number?: string;
};

export type UserBody = Omit<User, "_id">;
