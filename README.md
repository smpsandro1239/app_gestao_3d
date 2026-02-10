# Gestão de Negócio de Impressão 3D 🚀

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![React Native](https://img.shields.io/badge/react_native-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Expo](https://img.shields.io/badge/expo-1B1F23?style=for-the-badge&logo=expo&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)

Este projeto é uma solução completa para gerir um negócio de impressão 3D, incluindo um backend robusto e uma aplicação mobile profissional.

## Índice

- [Estrutura do Projeto](#estrutura-do-projeto)
- [Demonstração Online](#demonstração-online-grátis)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Como Iniciar a Aplicação](#como-iniciar-a-aplicação)
- [Visualização e Testes](#visualização-e-testes)
- [Funcionalidades Incríveis](#funcionalidades-incríveis)
- [Licença](#licença)

## Estrutura do Projeto

- **/backend**: API desenvolvida com NestJS, TypeORM e PostgreSQL.
- **/mobile**: Aplicação mobile desenvolvida com React Native e Expo.

## Demonstração Online (Grátis)

Para ver a aplicação a funcionar agora mesmo:

| Componente | Link de Demonstração | Deploy Rápido |
| :--- | :--- | :--- |
| **App Mobile (Web)** | [Ver Demo Web (Vercel)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fsmpsandro1239%2Fapp_gestao_3d%2Ftree%2Fmain%2Fmobile) | [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fsmpsandro1239%2Fapp_gestao_3d%2Ftree%2Fmain%2Fmobile) |
| **Backend API** | [Documentação Swagger (Render)](https://render.com/deploy?repo=https://github.com/smpsandro1239/app_gestao_3d/tree/main/backend) | [![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/smpsandro1239/app_gestao_3d/tree/main/backend) |

> **Nota:** A demo web permite navegar no catálogo e ver o dashboard. Para o funcionamento total (DB), deve fazer o deploy do backend.

## Tecnologias Utilizadas

### Backend

- NestJS
- PostgreSQL
- Docker & Docker Compose
- JWT & Google OAuth
- ExcelJS & PDFMake

### Mobile

- React Native (Expo)
- React Navigation
- Axios
- Lucide React Native (Ícones)

## Como Iniciar a Aplicação

Pode iniciar a solução de duas formas: usando **Docker** (recomendado para simplicidade) ou **Manualmente**.

### 1. Usando Docker (Recomendado) 🐳

Esta é a forma mais rápida de ter todo o ambiente (Banco de Dados + API) a funcionar.

1. **Pré-requisitos**: Ter o [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado e em execução.
2. **Iniciar**: Na raiz do projeto, execute:

   ```bash
   docker-compose up -d --build
   ```

3. **Verificar**:
   - **API**: `http://localhost:3000`
   - **Documentação (Swagger)**: `http://localhost:3000/api`

### 2. Manualmente (Desenvolvimento) 🛠️

Se preferir correr os serviços individualmente:

#### Backend (API)

1. Certifique-se de que tem um servidor **PostgreSQL** a correr.
2. Entre na pasta `backend`:

   ```bash
   cd backend
   npm install
   ```

3. Configure o ficheiro `.env` com as suas credenciais de base de dados.
4. Inicie o servidor:

   ```bash
   npm run start:dev
   ```

#### Mobile (App)

1. Entre na pasta `mobile`:

   ```bash
   cd mobile
   npm install
   ```

2. Inicie o Expo:

   ```bash
   npm start
   # OU para ver no browser:
   npm run web
   ```

3. **Para ver no telemóvel**: Instale a app **Expo Go** (Android/iOS) e leia o QR Code que aparece no terminal.

---

## Visualização e Testes

- **WebApp**: Se iniciou o mobile com `npm run web`, pode aceder em `http://localhost:8081`.
- **Swagger**: Explore todos os endpoints da API em `http://localhost:3000/api`.
- **Logs**: Para ver os logs em tempo real do Docker: `docker-compose logs -f`.

## Funcionalidades Incríveis

- **📦 Catálogo Digital**: Navegação fluida de produtos 3D com preços dinâmicos.
- **🔐 Autenticação Google**: Login seguro e rápido para administradores.
- **📝 Gestão de Pedidos**: Acompanhamento completo desde o pedido até à entrega final.
- **💰 Controlo Financeiro**:
  - Registo automático de entradas e saídas.
  - Cálculo de lucro por peça (incluindo custo de filamento e energia).
- **📊 Relatórios Inteligentes**: Exportação de dados para **Excel** e **PDF** com um clique.
- **📱 Design Adaptativo**: Experiência premium tanto em dispositivos móveis como na web.

## Licença

Este projeto está sob a licença MIT.
