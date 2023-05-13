import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CartItems } from './cart_items.entity';

export enum Status {
  OPEN = 'OPEN',
  ORDERED = 'ORDERED',
  IN_PROGRESS = 'IN_PROGRESS',
}

@Entity()
export class Carts {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: false })
  user_id: string;

  @Column({ type: 'timestamptz', nullable: false, default: new Date() })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: false,
  })
  updated_at: Date;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.OPEN,
  })
  status: Status;

  @OneToMany(
    () => CartItems,
    (cartItems: CartItems) => cartItems.cart,
    {
      cascade: true,
    },
  )
  @JoinColumn({ name: 'id', referencedColumnName: 'cart_id' })
  cartItems: CartItems[] | [];
}
