export type PaginatedResponse<T> = {
  data: T[];
  nextPage: number | null;
};

export type DataTypes = {
  id: string | number;
  [key: string]: any;
};

export interface NoDataProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

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
