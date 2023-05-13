import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Carts, Status } from '../../database/entities/carts.entity';
import { v4 } from 'uuid';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Carts)
    private readonly userCart: Repository<Carts>,
  ) {}

  async findByUserId(userId: string): Promise<Carts> {
    return this.userCart.findOne({
      where: { user_id: userId, status: Status.OPEN },
      relations: ['cartItems'],
    });
  }

  async createByUserId(userId: string): Promise<void | Carts> {
    const id = v4(v4());

    await this.userCart.save({
      id,
      user_id: userId,
    });
  }

  async findOrCreateByUserId(userId: string): Promise<void | Carts> {
    const userCart = await this.findByUserId(userId);

    if (userCart) {
      return userCart;
    }

    return this.createByUserId(userId);
  }

  async updateByUserId(userId: string, { items }) {
    const { id, ...rest } = (await this.findOrCreateByUserId(userId)) as Carts;

    const updatedCart = {
      id,
      ...rest,
      cartItems: [...items],
      updated_at: new Date(),
    };

    await this.userCart.save(updatedCart);

    const current = await this.findByUserId(userId);

    return current;
  }

  async removeByUserId(userId): Promise<void> {
    const current = await this.findByUserId(userId);
    if (current) await this.userCart.delete({ user_id: userId });
  }

  async markAsOrderedByUserId(userId: string): Promise<void> {
    const userCart = await this.findByUserId(userId);

    if (userCart) {
      await this.userCart.update(
        { id: userCart.id },
        { status: Status.ORDERED },
      );
    }
  }
}
