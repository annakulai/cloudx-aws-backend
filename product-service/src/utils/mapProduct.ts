import { Product } from 'src/types';
import { ProductModel, StockModel } from 'src/types/dbModel';

export const mapProduct = (
  productModel: ProductModel,
  stockModel: StockModel
): Product => ({
  ...productModel,
  count: stockModel.count,
});
