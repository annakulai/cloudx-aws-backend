export type ProductResponse = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
};

export type Product = {
  id: number;
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
