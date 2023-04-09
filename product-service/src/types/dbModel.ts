export type ProductModel = {
  id: string;
  title: string;
  price: number;
  description: string;
  image: string;
};

export type StockModel = {
  product_id: string;
  count: number;
};
