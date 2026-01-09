# Gestão de Negócio de Impressão 3D 🚀

Este projeto é uma solução completa para gerir um negócio de impressão 3D, incluindo um backend robusto e uma aplicação mobile profissional.

## 📦 Estrutura do Projeto

- **/backend**: API desenvolvida com NestJS, TypeORM e PostgreSQL.
- **/mobile**: Aplicação mobile desenvolvida com React Native e Expo.

## 🚀 Demonstração Online (Grátis)

Para ver a aplicação a funcionar agora mesmo:

| Componente | Link de Demonstração | Deploy Rápido |
| :--- | :--- | :--- |
| **App Mobile (Web)** | [Ver Demo Web (Vercel)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fsmpsandro1239%2Fapp_gestao_3d%2Ftree%2Fmain%2Fmobile) | [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fsmpsandro1239%2Fapp_gestao_3d%2Ftree%2Fmain%2Fmobile) |
| **Backend API** | [Documentação Swagger (Render)](https://render.com/deploy?repo=https://github.com/smpsandro1239/app_gestao_3d/tree/main/backend) | [![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/smpsandro1239/app_gestao_3d/tree/main/backend) |

> **Nota:** A demo web permite navegar no catálogo e ver o dashboard. Para o funcionamento total (DB), deve fazer o deploy do backend.

## 🛠️ Tecnologias Utilizadas

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

## ⚙️ Guia de Instalação Quickstart

### Backend (Docker - Recomendado)

1. Certifique-se de ter o Docker instalado.
2. Na raiz do projeto, execute:

   ```bash
   docker-compose up --build
   ```

3. O backend estará disponível em `http://localhost:3000`.

### Mobile

1. Entre na pasta `mobile`:

   ```bash
   cd mobile
   npm install
   ```

2. Inicie o Expo:

   ```bash
   npm start
   ```

3. Use o app Expo Go no seu telemóvel para ler o QR Code.

## 📝 Funcionalidades

- **Catálogo Público**: Navegação de produtos sem login.
- **Área Administrativa**: Login com Google.
- **Gestão de Pedidos**: Fluxo completo desde a receção até à entrega.
- **Finanças**: Controlo automático de entradas, saídas e lucro.
- **Relatórios**: Exportação para Excel e PDF.

## 📄 Licença

Este projeto está sob a licença MIT.
