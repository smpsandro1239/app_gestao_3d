import { DataSource } from 'typeorm';
import { User, Filament, Printer, Product, MaterialType, PrinterStatus } from '../entities';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  username: process.env.DATABASE_USER || 'gestao3d',
  password: process.env.DATABASE_PASSWORD || 'gestao3d_password',
  database: process.env.DATABASE_NAME || 'app_gestao_3d',
  entities: [User, Filament, Printer, Product],
  synchronize: true,
});

async function runSeed() {
  console.log('🌱 Starting database seed...');
  await dataSource.initialize();

  // 1. Seed Admin User
  const userRepo = dataSource.getRepository(User);
  const adminEmail = 'admin@gestao3d.com';
  let admin = await userRepo.findOne({ where: { email: adminEmail } });

  if (!admin) {
    admin = userRepo.create({
      email: adminEmail,
      nome: 'Administrador Principal',
      password: 'admin123', // Em produção, usar hash!
    });
    await userRepo.save(admin);
    console.log('✅ Admin user created');
  } else {
    console.log('ℹ️ Admin user already exists');
  }

  // 2. Seed Filaments
  const filamentRepo = dataSource.getRepository(Filament);
  const filamentsCount = await filamentRepo.count();

  if (filamentsCount === 0) {
    const defaultFilaments = [
      { marca: 'Prusament', material: MaterialType.PLA, cor: 'Preto Jet Black', corHex: '#000000', pesoInicial: 1000, pesoAtual: 1000, custo: 29.99 },
      { marca: 'Eryone', material: MaterialType.PETG, cor: 'Branco', corHex: '#FFFFFF', pesoInicial: 1000, pesoAtual: 850, custo: 21.50 },
      { marca: 'Esun', material: MaterialType.ABS, cor: 'Vermelho', corHex: '#FF0000', pesoInicial: 1000, pesoAtual: 1000, custo: 23.00 },
    ];
    await filamentRepo.save(filamentRepo.create(defaultFilaments as any));
    console.log('✅ Default filaments created');
  }

  // 3. Seed Printers
  const printerRepo = dataSource.getRepository(Printer);
  const printersCount = await printerRepo.count();

  if (printersCount === 0) {
    const defaultPrinters = [
      { nome: 'Prusa MK4 #1', modelo: 'Original Prusa MK4', status: PrinterStatus.IDLE },
      { nome: 'Bambu P1S #1', modelo: 'Bambu Lab P1S', status: PrinterStatus.IDLE },
    ];
    await printerRepo.save(printerRepo.create(defaultPrinters));
    console.log('✅ Default printers created');
  }

  // 4. Seed Products
  const productRepo = dataSource.getRepository(Product);
  const productsCount = await productRepo.count();

  if (productsCount === 0) {
    const defaultProducts = [
      { nome: 'Vaso Geométrico M', preco: 15.00, custoProducao: 3.50, pesoEstimado: 120, tempoImpressao: 360, stockQuantity: 5 },
      { nome: 'Suporte Headset Pro', preco: 12.50, custoProducao: 2.20, pesoEstimado: 80, tempoImpressao: 240, stockQuantity: 10 },
      { nome: 'Articulated Dragon', preco: 25.00, custoProducao: 5.00, pesoEstimado: 200, tempoImpressao: 720, stockQuantity: 2 },
    ];
    await productRepo.save(productRepo.create(defaultProducts));
    console.log('✅ Default products created');
  }

  console.log('🌳 Seed finished successfully!');
  await dataSource.destroy();
}

runSeed().catch((error) => {
  console.error('❌ Error during seed:', error);
  process.exit(1);
});
