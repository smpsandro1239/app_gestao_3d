# Seed da Base de Dados

Este documento explica como popular a base de dados com dados iniciais para desenvolvimento e testes.

## Pré-requisitos

1. **Base de dados PostgreSQL a correr**
   - Via Docker: `docker-compose up -d`
   - Ou PostgreSQL instalado localmente

2. **Variáveis de ambiente configuradas**
   - Certifique-se que o ficheiro `.env` está configurado corretamente
   - Verifique as credenciais da base de dados

## Como Executar o Seed

### 1. Iniciar a Base de Dados

Se estiver a usar Docker:
```bash
cd backend
docker-compose up -d
```

Aguarde alguns segundos para a base de dados inicializar completamente.

### 2. Executar o Seed

```bash
cd backend
npm run seed
```

## Dados Criados

O seed cria os seguintes dados de exemplo:

### Utilizadores
- **Email**: `admin@gestao3d.pt`
- **Password**: `admin123` (apenas para desenvolvimento)
- **Nome**: Administrador

### Clientes (4 clientes)
- João Silva (Lisboa)
- Maria Santos (Porto)
- Pedro Costa (Coimbra)
- Ana Rodrigues (Braga)

### Filamentos (6 bobines)
- **Creality PLA** - Preto (750g restantes)
- **Creality PLA** - Branco (890g restantes)
- **eSUN PETG** - Azul (450g restantes)
- **Prusament PLA** - Vermelho (920g restantes)
- **Sunlu TPU** - Transparente (380g restantes)
- **eSUN ABS** - Cinzento (650g restantes)

### Produtos (6 produtos)
- Vaso Decorativo Geométrico (€12.50)
- Porta-Chaves Personalizado (€4.99)
- Suporte para Telemóvel (€8.50)
- Organizador de Secretária (€15.00)
- Miniatura Decorativa (€25.00)
- Caixa de Arrumação Modular (€6.50)

## Notas Importantes

⚠️ **Atenção**:
- O seed verifica se os dados já existem antes de criar
- Pode executar o seed múltiplas vezes sem duplicar dados
- A password do utilizador admin é **apenas para desenvolvimento**
- Em produção, use sempre passwords seguras e hash adequado

## Resolução de Problemas

### Erro de Conexão
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
**Solução**: A base de dados não está a correr. Execute `docker-compose up -d`

### Erro de Autenticação
```
Error: password authentication failed
```
**Solução**: Verifique as credenciais no ficheiro `.env`

### Tabelas Não Existem
```
Error: relation "utilizadores" does not exist
```
**Solução**: Execute a aplicação uma vez para criar as tabelas automaticamente:
```bash
npm run start:dev
```
Aguarde a criação das tabelas, depois pare e execute o seed.

## Limpar Dados

Para limpar todos os dados e recomeçar:

```bash
# Parar e remover containers
docker-compose down -v

# Reiniciar
docker-compose up -d

# Aguardar inicialização
sleep 5

# Executar seed
npm run seed
```
