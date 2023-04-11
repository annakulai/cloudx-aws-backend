import { errorResponse, successResponse } from '@libs/api-gateway';
import { productService } from '@libs/dynamodb-connector';
import { middyfy } from '@libs/lambda';
import Logger from '@service/loggerService';

export const getProductsList = async (event) => {
  try {
    Logger.logRequest(`Incoming event: ${JSON.stringify(event)}`);

    const products = await productService.getAllProducts();

    return successResponse(products, 200);
  } catch (error) {
    Logger.logError('getProductsList lambda error', error);
    return errorResponse({ message: error?.message });
  }
};

export const main = middyfy(getProductsList);
