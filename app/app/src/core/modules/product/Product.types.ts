export type Product = {
  _id: string;
  name: string;
  ownerId: string;
  description: string;
  price: number;
  category: "Haircare" | "Skincare" | "Make-up" | "Tools" | "Other";
  brandName: string;
  stock: number;
};

export type ProductBody = Omit<Product, "_id">;
