import { ProductResponse, Product } from '../types';
import products from './mock.json';

const getAllProducts = async (): Promise<Product[]> => {
  const response: ProductResponse[] = await Promise.resolve(products);

  return response.map(
    ({ id, title, price, description, image, rating: { count } }) => ({
      id,
      title,
      price,
      description,
      image,
      count,
    })
  );
};

const getProductById = async (id: number): Promise<Product> => {
  const products = await getAllProducts();

  return products.find((product) => product.id === id);
};

export { getAllProducts, getProductById };
