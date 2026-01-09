# Gestão de Negócio de Impressão 3D 🚀

Este projeto é uma solução completa para gerir um negócio de impressão 3D, incluindo um backend robusto e uma aplicação mobile profissional.

## 📦 Estrutura do Projeto

- **/backend**: API desenvolvida com NestJS, TypeORM e PostgreSQL.
- **/mobile**: Aplicação mobile desenvolvida com React Native e Expo.

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

## 🚀 Como Executar

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
