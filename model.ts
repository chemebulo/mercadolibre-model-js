export type Category = {
  id: string;
  name: string;
};

export type Characteristic = {
  name: string;
  value: string;
};

export type Shipping = {
  price: number;
};

export type Product = {
  id: string;
  owner: User;
  title: string;
  description: string;
  images: string[];
  stock: number;
  price: number;
  shipping: Shipping;
  characteristics: Characteristic[];
  category: Category;
  questions: Question[];
};

export type SaleHistory = {
  product: Product;
  amount: number;
  payment: Payment;
  date: Date;
  user: User;
};

export type PurchaseHistory = {
  items: Item[];
  payment: Payment;
  date: Date;
};

export type Question = {
  id: string;
  product: Product;
  user: User;
  text: string;
  response?: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  image: string;
  purchaseHistory: PurchaseHistory[];
  products: Product[];
  likedProducts: Product[];
  salesHistory: SaleHistory[];
};

export type Item = {
  product: Product;
  amount: number;
};

export type Cart = {
  user: User;
  items: Item[];
};

export type Payment = {
  cardNumber: string;
  expirationDate: Date;
  cvv: string;
  name: string;
};
