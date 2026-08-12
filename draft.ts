import { Category, Characteristic, Shipping } from "./model.js";

export type DraftNewUser = {
  name: string;
  email: string;
  password: string;
  image: string;
};

export type DraftProduct = {
  title: string;
  description: string;
  price: number;
  images: string[];
  stock: number;
  shipping: Shipping;
  characteristics: Characteristic[];
  category: Category;
}
