import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export enum PrinterStatus {
  IDLE = 'IDLE',
  PRINTING = 'PRINTING',
  ERROR = 'ERROR',
  MAINTENANCE = 'MAINTENANCE',
}

@Entity('impressoras')
export class Printer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @Column()
  modelo: string;

  @Column({
    type: 'enum',
    enum: PrinterStatus,
    default: PrinterStatus.IDLE,
  })
  status: PrinterStatus;

  @Column({ nullable: true })
  currentOrderId: number;

  @Column('int', { default: 0 })
  progressoAtual: number; // Porcentagem de 0 a 100

  @Column({ nullable: true })
  trabalhoAtual: string; // Nome do modelo sendo impresso

  @CreateDateColumn()
  dataCriacao: Date;

  @UpdateDateColumn()
  dataAtualizacao: Date;
}
