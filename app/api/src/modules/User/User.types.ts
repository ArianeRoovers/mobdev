import { Document } from "mongoose";

export type UserMethods = {
  comparePassword: (password: string) => Promise<boolean>;
  generateToken: () => string;
};

export type User = Document &
  UserMethods & {
    _id?: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: "seller" | "user";
    avatar: string;
    bio: string;
    phone_number: string;
    brandName: string;
  };
