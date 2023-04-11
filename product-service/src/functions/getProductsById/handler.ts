import {
  errorNonFoundResponse,
  errorResponse,
  successResponse,
} from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { productService } from '@libs/dynamodb-connector';
import Logger from '@service/loggerService';

export const getProductByIdHandler = async (event) => {
  try {
    Logger.logRequest(`Incoming event: ${JSON.stringify(event)}`);

    const { productId } = event.pathParameters;

    const product = await productService.getProductById(productId);

    if (product) {
      return successResponse({ ...product });
    }

    return errorNonFoundResponse('Product not found');
  } catch (error) {
    Logger.logError('getProductByIdHandler lambda error', error);

    return errorResponse({
      message: error?.message,
    });
  }
};

export const main = middyfy(getProductByIdHandler);
