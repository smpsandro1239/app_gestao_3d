# Instruções de Deploy 🚀

Este guia explica como colocar a aplicação em produção.

## 🐳 Backend (Docker)

O backend está preparado para correr num ambiente Docker.

1. **Configuração de Domínio e SSL**:
   - Recomenda-se o uso de **Nginx** como Reverse Proxy.
   - Use o **Certbot** para gerar certificados SSL gratuitos.

2. **Variáveis de Ambiente**:
   - No servidor, crie um ficheiro `.env` com as credenciais reais de produção.
   - Altere `JWT_SECRET`, `GOOGLE_CLIENT_ID` e `GOOGLE_CLIENT_SECRET`.

3. **Comando de Deploy**:
   ```bash
   docker-compose up -d --build
   ```

## 📱 Mobile (EAS Build)

Para a aplicação mobile, recomenda-se o uso do Expo Application Services (EAS).

1. **Instalar EAS CLI**:
   ```bash
   npm install -g eas-cli
   ```

2. **Login no Expo**:
   ```bash
   eas login
   ```

3. **Build para Android/iOS**:
   ```bash
   eas build --platform android
   ```

## 🔐 Segurança
- Altere todas as passwords padrão em `docker-compose.yml` e `.env`.
- Não exponha a porta `5432` (PostgreSQL) para a internet; mantenha-a acessível apenas internamente via Docker.
