import { API } from "@core/network/api";
import { User, UserBody } from "./User.types";

const getCurrentUser = () => {
  return API.get<User>("/users/current");
};

const updateUserData = (userId: string, userData: UserBody): Promise<User> => {
  return API.patch(`/users/${userId}`, userData).then(
    (response) => response.data
  );
};

const deleteUser = (userId: string) => {
  return API.delete(`/users/${userId}`);
};

const getAllBrands = () => {
  return API.get<string[]>("/brands");
};

export const getUserByBrandName = (brandName: string) => {
  return API.get<User>(`/users/brand/${brandName}`);
};

export { getCurrentUser, updateUserData, deleteUser, getAllBrands };
