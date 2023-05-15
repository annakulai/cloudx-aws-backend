import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Carts, Status } from './carts.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: true })
  user_id: string;

  @OneToOne(() => Carts)
  @JoinColumn({ name: 'cart_id', referencedColumnName: 'id' })
  cart: Carts;

  @Column({ type: 'json', nullable: false, default: '{}' })
  payment: JSON;

  @Column({ type: 'json', nullable: false, default: '{}' })
  delivery: JSON;

  @Column({ type: 'text', nullable: false, default: '' })
  comments: string;

  @Column({
    type: 'enum',
    enum: Status,
    nullable: false,
  })
  status: Status;

  @Column({ type: 'integer' })
  total: number;
}
