# 🎬 CineWeb - Sistema de Gestão de Cinema

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![Bootstrap](https://img.shields.io/badge/bootstrap-%23563D7C.svg?style=for-the-badge&logo=bootstrap&logoColor=white)

O **CineWeb** é uma aplicação web completa para administração de cinemas e venda de ingressos. O projeto utiliza uma arquitetura limpa baseada em componentes funcionais, validação robusta de dados e simulação de backend RESTful.

---

## 🚀 Funcionalidades Principais

### 1. 🎞️ Gestão de Filmes
- Cadastro completo com validação de campos.
- **Seleção de Gêneros:** Listbox com rolagem e carregamento dinâmico do banco de dados.
- **Exclusão em Cascata:** Ao excluir um filme, o sistema verifica e remove automaticamente todas as sessões vinculadas para manter a integridade dos dados.

### 2. 💺 Gestão de Salas (Matriz de Assentos)
- Criação dinâmica do layout da sala.
- Definição de **Filas x Colunas** que gera automaticamente uma matriz bidimensional (`int[][]`) no banco de dados.
- Visualização gráfica da capacidade da sala.

### 3. 🍿 Gestão de Produtos (Lanches)
- CRUD completo (Criar, Ler, Editar, Excluir) de Combos e Lanches.
- Interface intuitiva para atualização de preços e descrições.

### 4. 🎫 Venda de Ingressos (Caixa/PDV)
O coração do sistema. Um modal de vendas integrado que oferece:
- **Mapa de Assentos Visual:** Seleção interativa de poltronas com identificação inteligente (Ex: `A1`, `B5`).
- **Carrinho de Compras:** Adição e remoção de lanches com cálculo em tempo real.
- **Tipos de Ingresso:** Controle de quantidade de Inteiras e Meias-entradas.
- **Feedback Financeiro:** Exibição clara dos valores parciais e totais antes da confirmação.
- **Bloqueio Real:** Após a venda, os assentos tornam-se indisponíveis (vermelhos) para novas vendas.

---

## 🛠️ Tecnologias Utilizadas

- **Core:** React 18 + Vite
- **Linguagem:** TypeScript
- **Estilização:** Bootstrap 5 + Bootstrap Icons
- **Formulários & Validação:** React Hook Form + Zod
- **HTTP Client:** Axios
- **Backend Simulado:** Json-Server (API REST completa)

---

## 📂 Estrutura do Projeto (Clean Architecture)

O projeto segue uma estrutura organizada para facilitar a escalabilidade e manutenção:

```text
src/
├── components/      # Componentes de UI reutilizáveis (Input, Button, Nav)
├── models/          # Regras de validação (Schemas Zod) e lógica pura
├── pages/           # Telas da aplicação (Filmes, Salas, Sessões, Vendas)
├── routes/          # Configuração de rotas (React Router)
├── services/        # Configuração da API (Axios)
├── types/           # Definições de Tipagem (Interfaces TS)
└── App.tsx          # Componente Raiz
```
---

## ⚡ Como Rodar o Projeto
- Pré-requisitos
Node.js instalado (v14 ou superior)
### Passo 1: Clonar e Instalar
```
# Clone o repositório (ou baixe os arquivos)
git clone <link>

# Entre na pasta
cd cineweb

# Instale as dependências
npm install react-router-dom bootstrap bootstrap-icons axios react-hook-form zod @hookform/resolvers

# Backend
npm install -D json-server
```
### Passo 2: Configurar Variáveis de Ambiente
Crie um arquivo .env na raiz do projeto:
```
VITE_API_BASE_URL=http://localhost:3000
```
### Passo 3: Iniciar o Backend
O sistema precisa do json-server rodando para funcionar.
```
npm run server
```
### Passo 4: Iniciar o Frontend
Em um novo terminal, execute:
```
npm run dev
```
