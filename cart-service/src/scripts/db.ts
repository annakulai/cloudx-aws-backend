import { Client } from 'pg';
import { v4 as uuidv4 } from 'uuid';

// Client;
const client = new Client({
  host: 'postgresql-database-instance.cn1er0sauefx.us-east-1.rds.amazonaws.com',
  user: 'postgres',
  database: 'postgres',
  password: 'awsroot!',
  port: 5432,
  // not working locally
  ssl: {
    rejectUnauthorized: false,
  },
  connectionTimeoutMillis: 5000,
});

const run = async () => {
  const execute = async query => {
    try {
      await client.query(query); // sends queries
      return true;
    } catch (error) {
      console.error(error.stack);
      return false;
    }
  };

  const statusEnum = `
  DO $$ BEGIN
    CREATE type status AS ENUM ('OPEN', 'ORDERED');
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;
  `;

  const cartId = uuidv4();
  const cartTableQuery = `
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
  
    CREATE TABLE IF NOT EXISTS carts (  
      id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,  
      user_id uuid DEFAULT uuid_generate_v4 () NOT NULL,
      created_at TIMESTAMP NOT NULL,
      updated_at TIMESTAMP NOT NULL,
      status status NOT NULL
    );`;

  const now = new Date();

  const cartItemTableQuery = `
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

    CREATE TABLE IF NOT EXISTS cart_items (
      id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
      cart_id uuid,
      product_id uuid DEFAULT uuid_generate_v4 (),
      count INTEGER NOT NULL,
      FOREIGN KEY(cart_id) REFERENCES carts(id) ON UPDATE CASCADE ON DELETE CASCADE
    );`;

  try {
    await client.connect();

    execute(statusEnum);

    execute(cartTableQuery);
    const insertTimestamp =
      'INSERT INTO carts(id, user_id, status, created_at, updated_at) VALUES ($1, $2, $3, $4, $5)';
    await client.query(insertTimestamp, [cartId, uuidv4(), 'OPEN', now, now]);

    execute(cartItemTableQuery);
    const insertCartId =
      'INSERT INTO cart_items(cart_id, count, product_id) VALUES ($1, $2, $3)';
    await client.query(insertCartId, [cartId, 2, uuidv4()]); //product_id -check from DynamoDb
  } catch (error) {
    console.log(error);
    throw error;
  } finally {
    await client.end(); // closes connection
  }
};

run();
