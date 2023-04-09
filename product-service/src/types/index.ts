export type Product = {
  id: string;
  title: string;
  price: number;
  description: string;
  image: string;
  count: number;
};

export type ProductBody = {
  title: string;
  price: number;
  description: string;
  image: string;
  count: number;
};

export type Products = Product[];

export interface ErrorResponse {
  message: string;
  statusCode?: number;
}
