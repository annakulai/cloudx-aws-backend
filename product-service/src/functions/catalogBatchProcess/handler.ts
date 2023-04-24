import { errorResponse } from '@libs/api-gateway';
import { productService } from '@libs/dynamodb-connector';
import { Product } from 'src/types';
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';

export const catalogBatchProcess = async (event) => {
  const products = event.Records.map(({ body }) => JSON.parse(body));
  const sns = new SNSClient({ region: 'us-east-1' });

  const promiseArr = [];

  products.forEach((product: Omit<Product, 'id'>) => {
    const newProduct = {
      title: product.title,
      description: product.description,
      price: Number(product.price),
      image: product.image,
      count: Number(product.count),
    };

    promiseArr.push(productService.createProduct(newProduct));
  });

  try {
    await Promise.all(promiseArr);

    await Promise.all(
      products.map((product) => {
        return sns.send(
          new PublishCommand({
            Subject: 'Products have been created!',
            Message: JSON.stringify(product),
            TopicArn: process.env.SNS_ARN,
            MessageAttributes: {
              price: {
                DataType: 'Number',
                StringValue: `${product.price}`,
              },
            },
          })
        );
      })
    );

    console.log('SNS subscription created!');
  } catch (error) {
    return errorResponse({ message: error?.message });
  }
};

export const main = catalogBatchProcess;
