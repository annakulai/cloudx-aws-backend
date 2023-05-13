import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from '../../database/entities/orders.entity';
import { Repository } from 'typeorm';
import { v4 } from 'uuid';
import { Status } from '../../database/entities/carts.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orders: Repository<Order>,
  ) {}

  async findById(orderId: string): Promise<Order> {
    return await this.orders.findOne({
      where: { id: orderId, status: Status.IN_PROGRESS },
    });
  }

  async create(data: any): Promise<Order> {
    const id = v4(v4());
    const order = {
      ...data,
      id,
      status: Status.IN_PROGRESS,
    };

    await this.orders.save(order);

    const current = await this.findById(id);

    return current;
  }

  async update(orderId: string, data): Promise<void> {
    const order = this.findById(orderId);

    if (!order) {
      throw new Error('Order does not exist.');
    }

    await this.orders.save({
      ...data,
      id: orderId,
    });
  }
}
