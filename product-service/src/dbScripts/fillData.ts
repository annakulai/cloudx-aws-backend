import * as products from '@service/mocks/mock.json';
import { v4 as uuidv4 } from 'uuid';
import { ddbDocClient } from '../db/ddbDocClient';
import { BatchWriteCommand } from '@aws-sdk/lib-dynamodb';

const FIRST_TABLE_NAME = 'products';
const SECOND_TABLE_NAME = 'stocks';

const putStockRequestItems = [];
const putProductRequestItems = [];

products.forEach(({ price, title, description, image }) => {
  const id = uuidv4();

  putProductRequestItems.push({
    PutRequest: { Item: { price, title, description, id, image } },
  });

  putStockRequestItems.push({
    PutRequest: {
      Item: {
        product_id: id,
        count: Math.floor(Math.random() * 100),
      },
    },
  });
});

const fillData = async () => {
  try {
    const run = async () => {
      await ddbDocClient.send(
        new BatchWriteCommand({
          RequestItems: {
            [FIRST_TABLE_NAME]: putProductRequestItems,
            [SECOND_TABLE_NAME]: putStockRequestItems,
          },
        })
      );
    };

    await run();
    console.log('Successfully done!');
  } catch (err) {
    console.log('Error', err.stack);
  }
};

fillData();
