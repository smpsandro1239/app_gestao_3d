# todolist.md — Gestão Impressão 3D App
Última atualização: 2026-02-10

## 1. Visão Geral & Requisitos Não-Funcionais

☑ 1.1 Definir paleta de cores, tipografia e espaçamentos (Design System v0)
☑ 1.2 Decidir: Expo ou React Native CLI ? (Expo 52 SDK)
☑ 1.3 Decidir: estratégia de autenticação offline (AsyncStorage + AuthContext)
☐ 1.4 Definir convenções de nomenclatura (português PT-PT - em progresso)

## 2. Infraestrutura & Ferramentas

☑ 2.1 Criar monorepo (backend / mobile na mesma raiz)
☐ 2.2 Configurar CI (GitHub Actions) – lint, test, build
☑ 2.3 Configurar ambiente de desenvolvimento local (docker-compose configurado)

## 3. Backend (NestJS + PostgreSQL)

☑ 3.1 Estrutura inicial + .env + docker-compose
☑ 3.2 Autenticação (JWT implementado, falta validar Google OAuth)
☑ 3.3 Módulo Users
☑ 3.4 Módulo Clientes + histórico
☑ 3.5 Módulo Produtos (Base implementada)
☑ 3.6 Módulo Pedidos + itens + estados + cálculos financeiros
☑ 3.7 Módulo Financeiro (Serviço base + Dashboard)
☑ 3.8 Módulo Relatórios (Stats Service implementado)
☑ 3.9 Módulo Uploads (Local storage implementado)
☐ 3.10 Migrations + seed inicial (Sprint 1)
☑ 3.11 OpenAPI / Swagger automático (Configurado em main.ts)
☐ 3.12 Testes unitários + e2e (mínimo 70% coverage nas regras de negócio)

## 4. Mobile (React Native)

☑ 4.1 Estrutura de pastas + navegação (React Navigation)
☑ 4.2 Auth context + Login Screen (Google Sign-In pendente configuração nativa)
☐ 4.3 Área pública: catálogo + detalhe produto
□ 4.4 Área privada (tabs):
   ☑ 4.4.1 Dashboard (KPIs implementados)
   ☑ 4.4.2 Pedidos (lista + detalhe + ações básicos)
   ☑ 4.4.3 Produtos (lista + formulário básico)
   ☑ 4.4.4 Clientes (lista básica)
   ☑ 4.4.5 Finanças (Tela FinanceScreen criada)
☑ 4.5 Componentes reutilizáveis + design system básico
☑ 4.6 Estado global (Contexts implementados)
□ 4.7 Tratamento de loading / erro / offline (Sprint 1) (☑)
☑ 4.8 Formulários com validação (Formik + Yup) (Sprint 1)
☐ 4.9 Testes básicos de UI (Detox ou React Native Testing Library)

## 5. Qualidade & Deploy

☐ 5.1 Conventional commits + git hooks (commitlint, husky)
☐ 5.2 Lint + Prettier + TypeScript strict (Sprint 1)
☑ 5.3 Documentação técnica (DEPLOY.md e README.md iniciados)
☑ 5.4 Plano de deploy (Definido em DEPLOY.md)
☑ 5.5 Segurança básica (CORS, Rate Limit, Helmet) (Sprint 1)

## 6. Features Futuras / Nice-to-have (fora do MVP)

☐ 6.1 Notificações push / email
☐ 6.2 Estatísticas / gráficos avançados
☐ 6.3 Multi-utilizador com permissões granulares
☐ 6.4 Integração MB Way / Stripe
☐ 6.5 Catálogo com carrinho + checkout direto (e-commerce lite)
