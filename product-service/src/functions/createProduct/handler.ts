import { errorResponse, successResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { productService } from '@libs/dynamodb-connector';
import Logger from '@service/loggerService';
import { schema } from './validate';

export const createProduct = async (event) => {
  Logger.logRequest(`Incoming event: ${JSON.stringify(event)}`);

  try {
    try {
      await schema.validateAsync(event.body);
    } catch (err) {
      return errorResponse({ message: err?.message });
    }

    await productService.createProduct(event.body);

    return successResponse({
      message: 'Product created!',
    });
  } catch (error) {
    Logger.logError('createProduct lambda error', error);
    return errorResponse({ message: error?.message });
  }
};

export const main = middyfy(createProduct);
