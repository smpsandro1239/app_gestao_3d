import { DataSource } from 'typeorm';
import { Client } from '../../entities/client.entity';
import { Filament, MaterialType } from '../../entities/filament.entity';
import { Product } from '../../entities/product.entity';
import { User } from '../../entities/user.entity';

export async function runSeed(dataSource: DataSource) {
  console.log('🌱 A iniciar seed da base de dados...');

  const userRepository = dataSource.getRepository(User);
  const clientRepository = dataSource.getRepository(Client);
  const filamentRepository = dataSource.getRepository(Filament);
  const productRepository = dataSource.getRepository(Product);

  // 1. Criar utilizador administrador
  const existingUser = await userRepository.findOne({
    where: { email: 'admin@gestao3d.pt' },
  });

  if (!existingUser) {
    const adminUser = userRepository.create({
      email: 'admin@gestao3d.pt',
      nome: 'Administrador',
      // Autenticação via Google OAuth, sem password local
    });
    await userRepository.save(adminUser);
    console.log('✅ Utilizador administrador criado');
  } else {
    console.log('ℹ️  Utilizador administrador já existe');
  }

  // 2. Criar clientes de exemplo
  const clientsData = [
    {
      nome: 'João Silva',
      email: 'joao.silva@email.pt',
      telefone: '+351 912 345 678',
      morada: 'Rua das Flores, 123, Lisboa',
    },
    {
      nome: 'Maria Santos',
      email: 'maria.santos@email.pt',
      telefone: '+351 923 456 789',
      morada: 'Avenida da República, 45, Porto',
    },
    {
      nome: 'Pedro Costa',
      email: 'pedro.costa@email.pt',
      telefone: '+351 934 567 890',
      morada: 'Praça do Comércio, 78, Coimbra',
    },
    {
      nome: 'Ana Rodrigues',
      email: 'ana.rodrigues@email.pt',
      telefone: '+351 945 678 901',
      morada: 'Rua de Santa Catarina, 234, Braga',
    },
  ];

  for (const clientData of clientsData) {
    const existing = await clientRepository.findOne({
      where: { email: clientData.email },
    });
    if (!existing) {
      const client = clientRepository.create(clientData);
      await clientRepository.save(client);
    }
  }
  console.log('✅ Clientes de exemplo criados');

  // 3. Criar filamentos de exemplo
  const filamentsData = [
    {
      marca: 'Creality',
      material: MaterialType.PLA,
      cor: 'Preto',
      corHex: '#000000',
      pesoInicial: 1000,
      pesoAtual: 750,
      custo: 18.99,
      alertaMinimo: 100,
    },
    {
      marca: 'Creality',
      material: MaterialType.PLA,
      cor: 'Branco',
      corHex: '#FFFFFF',
      pesoInicial: 1000,
      pesoAtual: 890,
      custo: 18.99,
      alertaMinimo: 100,
    },
    {
      marca: 'eSUN',
      material: MaterialType.PETG,
      cor: 'Azul',
      corHex: '#0066CC',
      pesoInicial: 1000,
      pesoAtual: 450,
      custo: 24.99,
      alertaMinimo: 150,
    },
    {
      marca: 'Prusament',
      material: MaterialType.PLA,
      cor: 'Vermelho',
      corHex: '#FF0000',
      pesoInicial: 1000,
      pesoAtual: 920,
      custo: 29.99,
      alertaMinimo: 100,
    },
    {
      marca: 'Sunlu',
      material: MaterialType.TPU,
      cor: 'Transparente',
      corHex: '#CCCCCC',
      pesoInicial: 500,
      pesoAtual: 380,
      custo: 22.50,
      alertaMinimo: 80,
    },
    {
      marca: 'eSUN',
      material: MaterialType.ABS,
      cor: 'Cinzento',
      corHex: '#808080',
      pesoInicial: 1000,
      pesoAtual: 650,
      custo: 21.99,
      alertaMinimo: 100,
    },
  ];

  for (const filamentData of filamentsData) {
    const existing = await filamentRepository.findOne({
      where: {
        marca: filamentData.marca,
        material: filamentData.material,
        cor: filamentData.cor,
      },
    });
    if (!existing) {
      const filament = filamentRepository.create(filamentData);
      await filamentRepository.save(filament);
    }
  }
  console.log('✅ Filamentos de exemplo criados');

  // 4. Criar produtos de exemplo
  const productsData = [
    {
      nome: 'Vaso Decorativo Geométrico',
      descricao:
        'Vaso moderno com design geométrico, perfeito para plantas pequenas',
      preco: 12.5,
      custoProducao: 3.2,
      pesoEstimado: 85,
      tempoImpressao: 180,
      quantidadeStock: 5,
      imagemUrl: '/uploads/vaso-geometrico.webp',
    },
    {
      nome: 'Porta-Chaves Personalizado',
      descricao: 'Porta-chaves com nome ou iniciais personalizadas',
      preco: 4.99,
      custoProducao: 0.8,
      pesoEstimado: 15,
      tempoImpressao: 30,
      quantidadeStock: 15,
      imagemUrl: '/uploads/porta-chaves.webp',
    },
    {
      nome: 'Suporte para Telemóvel',
      descricao: 'Suporte ajustável para secretária, compatível com todos os telemóveis',
      preco: 8.5,
      custoProducao: 2.1,
      pesoEstimado: 45,
      tempoImpressao: 90,
      quantidadeStock: 8,
      imagemUrl: '/uploads/suporte-telemovel.webp',
    },
    {
      nome: 'Organizador de Secretária',
      descricao: 'Organizador modular para canetas, clips e pequenos objetos',
      preco: 15.0,
      custoProducao: 4.5,
      pesoEstimado: 120,
      tempoImpressao: 240,
      quantidadeStock: 3,
      imagemUrl: '/uploads/organizador.webp',
    },
    {
      nome: 'Miniatura Decorativa',
      descricao: 'Miniatura de edifício famoso para colecionadores',
      preco: 25.0,
      custoProducao: 6.8,
      pesoEstimado: 200,
      tempoImpressao: 420,
      quantidadeStock: 2,
      imagemUrl: '/uploads/miniatura.webp',
    },
    {
      nome: 'Caixa de Arrumação Modular',
      descricao: 'Caixa empilhável para organização de pequenos componentes',
      preco: 6.5,
      custoProducao: 1.9,
      pesoEstimado: 55,
      tempoImpressao: 120,
      quantidadeStock: 10,
      imagemUrl: '/uploads/caixa-arrumacao.webp',
    },
  ];

  for (const productData of productsData) {
    const existing = await productRepository.findOne({
      where: { nome: productData.nome },
    });
    if (!existing) {
      const product = productRepository.create(productData);
      await productRepository.save(product);
    }
  }
  console.log('✅ Produtos de exemplo criados');

  console.log('🎉 Seed concluído com sucesso!');
}
