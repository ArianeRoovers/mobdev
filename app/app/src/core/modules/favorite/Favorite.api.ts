import { API } from "@core/network/api";
import { Favorite } from "./Favorite.types";

const addFavorite = (productId: string) => {
  return API.post<Favorite>("/favorites", { productId });
};

const removeFavorite = (productId: string) => {
  return API.delete<Favorite>(`/favorites`, {
    data: { productId },
  });
};

const getFavorites = () => {
  return API.get<Favorite[]>("/favorites");
};

export { addFavorite, removeFavorite, getFavorites };
