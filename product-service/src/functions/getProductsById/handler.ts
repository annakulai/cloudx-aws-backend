import {
  errorNonFoundResponse,
  errorResponse,
  successResponse,
} from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { getProductById } from 'src/service';

export const getProductByIdHandler = async (event) => {
  try {
    const { productId } = event.pathParameters;

    const product = await getProductById(+productId);

    if (product) {
      return successResponse({ ...product });
    }

    return errorNonFoundResponse('Product not found');
  } catch (error) {
    return errorResponse({
      message: error?.message,
    });
  }
};

export const main = middyfy(getProductByIdHandler);
