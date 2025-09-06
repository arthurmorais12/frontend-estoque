# Sistema de Estoque

Frontend React moderno para um sistema de gestão de estoque, construído com Vite, TypeScript, Tailwind CSS e Shadcn/ui.

## Funcionalidades

- 🔐 **Autenticação** - Sistema de login e cadastro (mock)
- 📦 **Gestão de Produtos** - Listagem, criação e visualização de detalhes
- 🎨 **Interface Moderna** - UI responsiva e intuitiva
- ⚡ **Performance** - Construído com Vite para desenvolvimento rápido

## Tecnologias Utilizadas

- **React 18** com TypeScript
- **Vite** - Build tool moderno
- **Tailwind CSS** - Framework CSS utilitário
- **Shadcn/ui** - Componentes UI reutilizáveis
- **React Router** - Navegação SPA
- **Lucide React** - Ícones

## Pré-requisitos

- Node.js 16+ 
- npm ou yarn
- Backend C# rodando na porta 5062

## Instalação e Execução

1. **Instalar dependências:**
   ```bash
   npm install
   ```

2. **Iniciar o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

3. **Acessar a aplicação:**
   Abra [http://localhost:5173](http://localhost:5173) no navegador

## Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── ui/             # Componentes UI do Shadcn
│   └── ProtectedRoute.tsx
├── contexts/           # Contexts do React
│   └── AuthContext.tsx
├── pages/             # Páginas da aplicação
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── ProductsPage.tsx
│   ├── ProductFormPage.tsx
│   └── ProductDetailPage.tsx
├── services/          # Serviços de API
│   └── api.ts
└── lib/              # Utilitários
    └── utils.ts
```

## Telas da Aplicação

### 1. Login (`/login`)
- Formulário de autenticação
- Validação de campos
- Redirecionamento pós-login

### 2. Cadastro (`/register`)
- Criação de nova conta
- Validação de senhas
- Auto-login após registro

### 3. Listagem de Produtos (`/products`)
- Grid responsivo de produtos
- Informações de estoque e preço
- Botão para adicionar novos produtos
- Cards com status visual do estoque

### 4. Novo Produto (`/products/new`)
- Formulário de criação
- Validação de campos obrigatórios
- Integração com API backend

### 5. Detalhes do Produto (`/products/:id`)
- Visualização completa do produto
- Informações financeiras
- Status de estoque
- Navegação para outras ações

## API Integration

O frontend se conecta com o backend C# através dos seguintes endpoints:

- `GET /api/v1/Product` - Listar todos os produtos
- `POST /api/v1/Product` - Criar novo produto

### Estrutura do Produto

```typescript
interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  stockQuantity: number;
}
```

## Autenticação

O sistema utiliza autenticação simulada (mock) com armazenamento local:
- Dados salvos no `localStorage`
- Proteção de rotas implementada
- Context para gerenciamento global de estado

## Scripts Disponíveis

- `npm run dev` - Servidor de desenvolvimento
- `npm run build` - Build de produção
- `npm run preview` - Preview do build
- `npm run lint` - Verificação de código

## Características de Design

- **Responsivo** - Funciona em desktop, tablet e mobile
- **Acessível** - Componentes com suporte a leitores de tela
- **Moderno** - Design limpo e profissional
- **Intuitivo** - Navegação clara e feedback visual

## Status do Estoque

O sistema categoriza visualmente os produtos por estoque:
- 🟢 **Verde** - Estoque alto (>10 unidades)
- 🟡 **Amarelo** - Estoque baixo (1-10 unidades)  
- 🔴 **Vermelho** - Sem estoque (0 unidades)

## Próximos Passos

Para expandir o sistema, considere implementar:
- Edição de produtos existentes
- Sistema de autenticação real
- Filtros e busca
- Paginação para grandes listas
- Dashboard com métricas
- Exportação de relatórios