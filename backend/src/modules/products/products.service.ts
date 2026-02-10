import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../../entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService implements OnModuleInit {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async onModuleInit() {
    const products = await this.productRepository.count();
    if (products === 0) {
      console.log('Seeding initial products...');
      const initialProducts = [
        {
          nome: 'Miniatura Dragão 3D',
          descricao:
            'Uma miniatura detalhada de um dragão, perfeita para jogos de tabuleiro ou decoração.',
          preco: 29.9,
          custoProducao: 4.5,
          pesoEstimado: 120,
          tempoImpressao: 360,
          stockQuantity: 5,
          imagens: [
            'https://images.unsplash.com/photo-1508433957232-482813589c37?auto=format&fit=crop&q=80&w=400',
          ],
        },
        {
          nome: 'Vaso Geométrico Moderno',
          descricao: 'Vaso com design minimalista impresso em modo espiral.',
          preco: 19.0,
          custoProducao: 2.0,
          pesoEstimado: 80,
          tempoImpressao: 90,
          stockQuantity: 2,
          imagens: [
            'https://images.unsplash.com/photo-1578500484748-482c4488965d?auto=format&fit=crop&q=80&w=400',
          ],
        },
        {
          nome: 'Suporte Articulado Telemóvel',
          descricao: 'Suporte dobrável impresso numa só peça (print-in-place).',
          preco: 12.5,
          custoProducao: 1.2,
          pesoEstimado: 45,
          tempoImpressao: 120,
          stockQuantity: 10,
          imagens: [
            'https://images.unsplash.com/photo-1586105251261-72a756654ff1?auto=format&fit=crop&q=80&w=400',
          ],
        },
        {
          nome: 'Chaveiro Roda dentada',
          descricao: 'Chaveiro funcional com engrenagens planetárias.',
          preco: 7.5,
          custoProducao: 0.5,
          pesoEstimado: 15,
          tempoImpressao: 45,
          stockQuantity: 0,
          imagens: [
            'https://images.unsplash.com/photo-1590483736622-39da8af75bba?auto=format&fit=crop&q=80&w=400',
          ],
        },
      ];

      for (const p of initialProducts) {
        await this.create(p as any);
      }
    }
  }

  async findAll() {
    return await this.productRepository.find({ where: { ativo: true } });
  }

  async findOne(id: number) {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Produto com ID ${id} não encontrado.`);
    }
    return product;
  }

  async create(createProductDto: CreateProductDto) {
    const product = this.productRepository.create(createProductDto);
    return await this.productRepository.save(product);
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.findOne(id);
    Object.assign(product, updateProductDto);
    return await this.productRepository.save(product);
  }

  async remove(id: number) {
    const product = await this.findOne(id);
    product.ativo = false; // Soft delete
    return await this.productRepository.save(product);
  }
}
