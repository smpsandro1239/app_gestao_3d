import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { Client } from '../entities/client.entity';
import { Filament } from '../entities/filament.entity';
import { Finance } from '../entities/finance.entity';
import { OrderItem } from '../entities/order-item.entity';
import { Order } from '../entities/order.entity';
import { Printer } from '../entities/printer.entity';
import { Product } from '../entities/product.entity';
import { User } from '../entities/user.entity';
import { runSeed } from './seeds/seed';

// Carregar variáveis de ambiente
ConfigModule.forRoot({
  isGlobal: true,
});

const configService = new ConfigService();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: configService.get<string>('DATABASE_HOST'),
  port: configService.get<number>('DATABASE_PORT'),
  username: configService.get<string>('DATABASE_USER'),
  password: configService.get<string>('DATABASE_PASSWORD'),
  database: configService.get<string>('DATABASE_NAME'),
  entities: [
    User,
    Client,
    Product,
    Order,
    OrderItem,
    Finance,
    Filament,
    Printer,
  ],
  synchronize: false, // Não sincronizar automaticamente em produção
});

AppDataSource.initialize()
  .then(async () => {
    console.log('📦 Conexão com a base de dados estabelecida');
    await runSeed(AppDataSource);
    await AppDataSource.destroy();
    console.log('✅ Conexão fechada');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Erro ao executar seed:', error);
    process.exit(1);
  });
