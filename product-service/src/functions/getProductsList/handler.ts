import { errorResponse, successResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { getAllProducts } from 'src/service';

export const getProductsList = async () => {
  try {
    const products = await getAllProducts();

    return successResponse(products);
  } catch (error) {
    return errorResponse({ message: error?.message });
  }
};

export const main = middyfy(getProductsList);
