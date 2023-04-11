import {
  QueryCommand,
  QueryCommandOutput,
  QueryInput,
  ScanCommand,
  ScanCommandOutput,
  ScanInput,
  TransactWriteItemsCommand,
} from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { v4 as uuidv4 } from 'uuid';
import { Product, ProductBody, Products } from 'src/types';
import { mapProduct } from 'src/utils/mapProduct';
import { ProductModel, StockModel } from 'src/types/dbModel';

class ProducDynamoDBService {
  constructor(private readonly docClient: DynamoDBDocumentClient) {}

  private createInput = <T>(tableName: string, properties?: T) => ({
    TableName: tableName,
    ...properties,
  });

  private unmarshallResponse = (
    response: ScanCommandOutput | QueryCommandOutput
  ) => response.Items.map((item) => unmarshall(item));

  async getAllProducts(): Promise<Products> {
    const products = await this.docClient.send(
      new ScanCommand(
        this.createInput<ScanInput>(process.env.PRODUCTS_TABLE_NAME)
      )
    );

    const normalizedProductsResponse = this.unmarshallResponse(
      products
    ) as Omit<Products, 'count'>;

    const stocks = await this.docClient.send(
      new ScanCommand(
        this.createInput<ScanInput>(process.env.STOCKS_TABLE_NAME)
      )
    );

    const normalizedStocksResponse = this.unmarshallResponse(stocks);

    const result = normalizedProductsResponse.map((product) => {
      const stock = normalizedStocksResponse.find(
        (stock) => stock.product_id === product.id
      ) as StockModel;

      if (stock) return mapProduct(product, stock);
    });

    return result;
  }

  async getProductById(productId: string): Promise<Product> {
    const productCommand = new QueryCommand(
      this.createInput<Omit<QueryInput, 'TableName'>>(
        process.env.PRODUCTS_TABLE_NAME,
        {
          KeyConditionExpression: 'id = :id',
          ExpressionAttributeValues: {
            ':id': {
              S: productId,
            },
          },
        }
      )
    );

    const stockCommand = new QueryCommand({
      TableName: process.env.STOCKS_TABLE_NAME,
      KeyConditionExpression: 'product_id = :product_id',
      ExpressionAttributeValues: {
        ':product_id': {
          S: productId,
        },
      },
    });

    try {
      const product = await this.docClient.send(productCommand);
      const normalizedProduct = this.unmarshallResponse(
        product
      )[0] as ProductModel;

      const stock = await this.docClient.send(stockCommand);
      const normalizedStock = this.unmarshallResponse(stock)[0] as StockModel;

      return mapProduct(normalizedProduct, normalizedStock);
    } catch (error) {
      console.log(error);
    }
  }

  async createProduct({
    title,
    description,
    count,
    price,
    image,
  }: ProductBody) {
    const id = uuidv4();
    const product = marshall({ title, description, price, image, id });
    const stock = marshall({
      product_id: id,
      count,
    });

    const command = new TransactWriteItemsCommand({
      TransactItems: [
        {
          Put: {
            TableName: process.env.PRODUCTS_TABLE_NAME,
            Item: product,
          },
        },
        {
          Put: {
            TableName: process.env.STOCKS_TABLE_NAME,
            Item: stock,
          },
        },
      ],
    });

    try {
      await this.docClient.send(command);
    } catch (error) {
      console.log(error);
    }
  }
}

export default ProducDynamoDBService;
