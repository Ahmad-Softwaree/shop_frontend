import { Product, User } from "./types";

export type GlobalFormProps = {
  state?: "update" | "insert";
  onFinalClose?: () => void;
};

export type PaginationObject<T extends DataTypes> = {
  data: T[];
  next: boolean;
  total: number;
  total_page: number;
  page: number;
  limit: number;
};

export type DataTypes = User | Product;

export type FormFinalOperation = {
  onClose?: () => void;
};

export type QueryParam = {
  [key: string]: string | number | boolean | undefined | number[];
};
export type FormProps = {
  state: "insert" | "update";
  onFinalClose?: () => void;
};
export type NextUrlParams = {
  search?: string;
  page?: number;
  limit?: number;
  status?: string;
};

export type NextAsyncUrlParams = Promise<NextUrlParams>;
