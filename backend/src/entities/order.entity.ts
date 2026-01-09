import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Client } from './client.entity';
import { OrderItem } from './order-item.entity';

export enum OrderStatus {
  RECEBIDO = 'RECEBIDO',
  EM_PRODUCAO = 'EM_PRODUCAO',
  FINALIZADO = 'FINALIZADO',
  ENVIADO = 'ENVIADO',
  ENTREGUE = 'ENTREGUE',
  CANCELADO = 'CANCELADO',
}

@Entity('pedidos')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Client, (client) => client.pedidos)
  cliente: Client;

  @OneToMany(() => OrderItem, (item) => item.pedido, { cascade: true })
  itens: OrderItem[];

  @Column('decimal', { precision: 10, scale: 2 })
  total: number;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.RECEBIDO,
  })
  status: OrderStatus;

  @Column({ nullable: true })
  dataEntregaPrevista?: Date;

  @Column({ nullable: true })
  metodoEntrega?: string;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  custoEntrega: number;

  @Column('text', { nullable: true })
  notas?: string;

  @CreateDateColumn()
  dataCriacao: Date;

  @UpdateDateColumn()
  dataAtualizacao: Date;
}
