import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { Carts } from './entities/carts.entity';
import { CartItems } from './entities/cart_items.entity';
import { ConnectionOptions } from 'typeorm';
import { Order } from './entities/orders.entity';

const config: ConnectionOptions = {
  type: 'postgres',
  host: process.env.PG_HOST,
  username: process.env.PG_USERNAME,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: +process.env.PG_PORT,
  namingStrategy: new SnakeNamingStrategy(),
  entities: [Carts, CartItems, Order],
  synchronize: true,
  logging: true,
};

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...config,
    }),
    TypeOrmModule.forFeature([Carts, CartItems, Order]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
