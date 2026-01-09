import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Order } from './order.entity';

@Entity('clientes')
export class Client {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @Column({ unique: true, nullable: true })
  email: string;

  @Column({ nullable: true })
  telefone: string;

  @Column({ nullable: true })
  morada: string;

  @OneToMany(() => Order, (order) => order.cliente)
  pedidos: Order[];

  @CreateDateColumn()
  dataCriacao: Date;

  @UpdateDateColumn()
  dataAtualizacao: Date;
}
