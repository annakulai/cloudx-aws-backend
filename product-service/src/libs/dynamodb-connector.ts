import { ddbClient } from 'src/db/dbClient';
import ProductDynamoDBService from '@service/productDynamoDbService';

export const productService = new ProductDynamoDBService(ddbClient);
