import { API } from "@core/network/api";
import { Auth } from "./Auth.types";
import { saveAuthToken } from "@core/storage";

type LoginBody = {
  email: string;
  password: string;
};



export const login = async (body: LoginBody) => {
  const response = await API.post<Auth>("/login", body);
  const { token, role } = response.data;
  saveAuthToken(token);
  localStorage.setItem("userRole", role);
  return response.data;
};

type RegisterBody = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: "user" | "seller";
  brandName?: string;
};



export const register = async (body: RegisterBody) => {
  const response = await API.post<Auth>("/register", body);
  const { token, role } = response.data;
  saveAuthToken(token);
  localStorage.setItem("userRole", role);
  return response.data;
};
