export type QueryParam = {
  page?: number | string;
  limit?: number | string;
  search?: string;
  status?: string;
};

export type User = {
  id: string;
  twoFactorAuthEnabled?: boolean;
  twoFactorAuthSecret?: string | null;
  name: string;
  email: string;
  phone: string;
  username: string;
  password: string;
  createdAt: string;
  updatedAt: string;
};

export type Order = {
  id: number;
  productId: number;
  product: Product;
  userId: string;
  user: User;
};

export type Product = {
  id: number;
  name: string;
  desc: string;
  enName: string;
  arName: string;
  ckbName: string;
  enDesc: string;
  arDesc: string;
  ckbDesc: string;
  image: string;
  price: number;
  status: "AVAILABLE" | "SOLD_OUT";
  userId: number;
  createdAt: string;
  updatedAt: string | null;
  user?: User;
  orders?: Order[];
};
