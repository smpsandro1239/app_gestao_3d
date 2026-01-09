import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './order.entity';
import { Product } from './product.entity';

@Entity('itens_pedido')
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, (order) => order.itens)
  pedido: Order;

  @ManyToOne(() => Product)
  produto: Product;

  @Column('int')
  quantidade: number;

  @Column('decimal', { precision: 10, scale: 2 })
  precoUnitario: number;

  @Column({ nullable: true })
  cor: string;

  @Column({ nullable: true })
  material: string;

  @Column('int', { nullable: true })
  preenchimento: number;

  @Column('text', { nullable: true })
  observacoesTecnicas: string;
}
