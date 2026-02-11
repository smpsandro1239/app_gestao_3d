# Convenções do Projeto - Gestão Impressão 3D

Este documento define as convenções de nomenclatura e padrões de projeto para garantir a consistência entre o Backend e Mobile.

## 1. Nomenclatura (Português PT-PT)

Para o domínio de negócio, utilizamos o Português de Portugal (PT-PT).

### 1.1 Código (TypeScript)
- **Classes/Interfaces/Types**: Inglês (PascalCase). Ex: `Order`, `ProductService`.
- **Propriedades de Entidades/DTOs**: Português PT-PT (camelCase). Ex: `dataCriacao`, `valorTotal`.
- **Variáveis Locais/Funções**: Português ou Inglês, mas preferencialmente Português para lógica de negócio.
- **Enums**: Valores em Português (UPPER_CASE). Ex: `STATUS.PENDENTE`.

### 1.2 Base de Dados (PostgreSQL)
- **Tabelas**: Português, snake_case, plural. Ex: `pedidos`, `clientes`.
- **Colunas**: Português, snake_case. Ex: `data_criacao`, `preco_unitario`.

### 1.3 API (REST)
- **Endpoints**: Inglês, kebab-case. Ex: `/orders`, `/product-categories`.
- **Query Params**: camelCase.

### 1.4 Mobile (React Native)
- **Screens/Components**: Inglês (PascalCase). Ex: `DashboardScreen`, `ButtonCustom`.
- **Terminologia UI**: Sempre Português PT-PT. Ex: "Encomendas" em vez de "Pedidos" (se aplicável, mas o projeto usa "Pedidos" no código, manteremos consistência com o código).
  *Nota: Em Portugal usa-se tanto "Pedido" como "Encomenda", mas manteremos "Pedido" para alinhar com o backend já implementado.*

## 2. Arquitetura

### 2.1 Backend (NestJS)
- Seguir o padrão modular do NestJS.
- Utilizar DTOs para validação de entrada.
- Centralizar regras de negócio nos Services.

### 2.2 Mobile (React Native + Expo)
- Navegação via React Navigation (Stack + Tabs).
- Gestão de estado: Context API (para Auth e Settings) e Hooks para lógica local.
- Estilização: Utilizar o tema centralizado em `src/utils/theme.ts`.

## 3. Qualidade
- **Commits**: Seguir [Conventional Commits](https://www.conventionalcommits.org/).
- **Linting**: ESLint + Prettier obrigatório.
- **Testes**: Jest para unitários e E2E.
