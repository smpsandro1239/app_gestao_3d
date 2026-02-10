import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum MaterialType {
  PLA = 'PLA',
  PETG = 'PETG',
  ABS = 'ABS',
  TPU = 'TPU',
  ASA = 'ASA',
  RESIN = 'RESIN',
  NYLON = 'NYLON',
}

@Entity('filamentos')
export class Filament {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  marca: string;

  @Column({
    type: 'enum',
    enum: MaterialType,
    default: MaterialType.PLA,
  })
  material: MaterialType;

  @Column()
  cor: string;

  @Column({ nullable: true })
  corHex: string; // Ex: #000000

  @Column('decimal', { precision: 10, scale: 2 })
  pesoInicial: number; // em gramas

  @Column('decimal', { precision: 10, scale: 2 })
  pesoAtual: number; // em gramas

  @Column('decimal', { precision: 10, scale: 2 })
  custo: number; // Preço pago pelo carretel

  @Column('decimal', { precision: 10, scale: 2, default: 100 })
  alertaMinimo: number; // gramas para avisar que está acabando

  @Column({ default: true })
  ativo: boolean;

  @CreateDateColumn()
  dataCriacao: Date;

  @UpdateDateColumn()
  dataAtualizacao: Date;
}
