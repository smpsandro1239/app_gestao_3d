import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum FinanceType {
  ENTRADA = 'ENTRADA',
  SAIDA = 'SAIDA',
}

@Entity('financeiro')
export class Finance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: FinanceType,
  })
  tipo: FinanceType;

  @Column('decimal', { precision: 10, scale: 2 })
  valor: number;

  @Column()
  descricao: string;

  @Column({ nullable: true })
  referenciaPedidoId: number;

  @CreateDateColumn()
  data: Date;
}
