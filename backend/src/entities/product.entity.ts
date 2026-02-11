import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('produtos')
export class Product {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nome!: string;

  @Column('text', { nullable: true })
  descricao?: string;

  @Column('decimal', { precision: 10, scale: 2 })
  preco!: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  custoProducao!: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0, nullable: true })
  pesoEstimado!: number; // gramas

  @Column('int', { default: 0, nullable: true })
  tempoImpressao!: number; // minutos

  @Column('int', { default: 0 })
  stockQuantity!: number;

  @Column('text', { array: true, nullable: true })
  imagens?: string[];

  @Column({ default: true })
  ativo!: boolean;

  @CreateDateColumn()
  dataCriacao!: Date;

  @UpdateDateColumn()
  dataAtualizacao!: Date;
}
