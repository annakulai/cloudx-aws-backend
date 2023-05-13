import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Carts } from './carts.entity';

@Entity()
export class CartItems {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: false })
  product_id: string;

  @Column({ type: 'integer', nullable: true })
  count: number;

  // https://leoromanovsky.medium.com/a-blog-without-an-author-typeorm-creates-confusion-with-required-columns-and-optional-foreign-keys-1a3f932d4e67
  // https://orkhan.gitbook.io/typeorm/docs/relations#relation-options
  @ManyToOne(
    () => Carts,
    cart => cart.cartItems,
    {
      onDelete: 'CASCADE',
      orphanedRowAction: 'soft-delete',
    },
  )
  @JoinColumn({ name: 'cart_id', referencedColumnName: 'id' })
  cart: Carts;
}
