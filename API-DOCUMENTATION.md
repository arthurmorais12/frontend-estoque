# 📋 **API Documentation - Frontend para Backend**

Este documento descreve todas as chamadas de API que o frontend faz e o que espera de resposta do backend.

## 🌐 **Base URL**
```
http://localhost:5062/api/v1
```

---

## 🛍️ **PRODUTOS (Product API)**

### **1. GET /Product** - Listar Todos os Produtos
**Usado em:** Lista de produtos, detalhes do produto, formulário de edição

**Método:** GET  
**Endpoint:** `/Product`  
**Headers:** Nenhum header específico necessário

**Resposta Esperada:**
```typescript
Product[] // Array de produtos
```

**Modelo Product:**
```typescript
{
  id: number;           // ID único do produto
  name: string;         // Nome do produto (obrigatório)
  description?: string; // Descrição (opcional, pode ser null)
  price: number;        // Preço unitário (obrigatório, decimal)
  stockQuantity: number; // Quantidade em estoque (obrigatório, inteiro)
}
```

**Exemplo de resposta (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Notebook Dell Inspiron",
    "description": "Notebook para uso corporativo",
    "price": 2499.99,
    "stockQuantity": 15
  },
  {
    "id": 2,
    "name": "Mouse Sem Fio",
    "description": null,
    "price": 89.90,
    "stockQuantity": 0
  }
]
```

---

### **2. POST /Product** - Criar Novo Produto
**Usado em:** Formulário de criação de novo produto

**Método:** POST  
**Endpoint:** `/Product`  
**Headers:** 
```
Content-Type: application/json
```

**Body da Requisição:**
```typescript
{
  name: string;         // Nome do produto (obrigatório)
  description?: string; // Descrição (opcional)
  price: number;        // Preço unitário (obrigatório)
  stockQuantity: number; // Quantidade inicial (obrigatório)
}
```

**Exemplo de body:**
```json
{
  "name": "Teclado Mecânico",
  "description": "Teclado mecânico RGB para gamers",
  "price": 299.99,
  "stockQuantity": 25
}
```

**Resposta Esperada (201 Created):**
```typescript
Product // Produto criado com ID gerado pelo banco
```

**Exemplo de resposta:**
```json
{
  "id": 123,
  "name": "Teclado Mecânico",
  "description": "Teclado mecânico RGB para gamers",
  "price": 299.99,
  "stockQuantity": 25
}
```

---

### **3. PUT /Product/{id}** - Atualizar Produto Existente
**Usado em:** Formulário de edição de produto

**Método:** PUT  
**Endpoint:** `/Product/{id}`  
**Parâmetro URL:** `id` (number) - ID do produto a ser atualizado  
**Headers:** 
```
Content-Type: application/json
```

**Body da Requisição:**
```typescript
{
  name: string;         // Nome atualizado (obrigatório)
  description?: string; // Descrição atualizada (opcional)
  price: number;        // Preço atualizado (obrigatório)
  stockQuantity: number; // Quantidade atualizada (obrigatório)
}
```

**Exemplo de requisição:**
```
PUT /api/v1/Product/123
```

**Exemplo de body:**
```json
{
  "name": "Teclado Mecânico RGB Pro",
  "description": "Versão atualizada com iluminação RGB avançada",
  "price": 399.99,
  "stockQuantity": 30
}
```

**Resposta Esperada (200 OK):**
```typescript
Product // Produto atualizado
```

---

## 🔍 **Comportamento do Frontend**

### **Importante - Não há endpoint GET /Product/{id}**
O frontend atualmente **NÃO** faz chamadas para buscar produtos individuais. Ele sempre:
1. Chama `GET /Product` para obter todos os produtos
2. Filtra no client-side pelo ID quando necessário

**Páginas que fazem isso:**
- **ProductDetailPage**: Busca todos e filtra pelo ID
- **ProductFormPage** (modo edição): Busca todos e filtra pelo ID

### **Autenticação**
- Atualmente a autenticação é **mock** (armazenada no localStorage)
- **NÃO** há chamadas reais de API para login/registro
- Futuramente pode precisar de endpoints de auth

---

## ⚠️ **Tratamento de Erros**

O frontend espera os seguintes status HTTP:

| Status | Cenário | Ação do Frontend |
|--------|---------|-----------------|
| **200** | Sucesso (GET, PUT) | Processa dados normalmente |
| **201** | Criado com sucesso (POST) | Redireciona para lista |
| **400** | Bad Request | Mostra erro de validação |
| **404** | Produto não encontrado | Mostra "Produto não encontrado" |
| **500** | Erro interno do servidor | Mostra erro genérico |

### **Exemplo de resposta de erro:**
```json
{
  "message": "Produto não encontrado",
  "details": "O produto com ID 999 não existe"
}
```

---

## ✅ **Validações Necessárias**

### **Para todos os produtos:**
- `name`: 
  - Obrigatório
  - Não pode ser vazio ou apenas espaços
  - Máximo 255 caracteres
- `price`: 
  - Obrigatório
  - Deve ser maior que 0
  - Formato decimal (ex: 99.99)
- `stockQuantity`: 
  - Obrigatório
  - Deve ser maior ou igual a 0
  - Número inteiro
- `description`: 
  - Opcional (pode ser null/undefined)
  - Se fornecida, máximo 1000 caracteres

---

## 📊 **Resumo de Uso das APIs**

| Endpoint | Método | Usado em | Frequência |
|----------|--------|----------|------------|
| `/Product` | GET | Lista, Detalhes, Edição | Alta - toda navegação |
| `/Product` | POST | Criar produto | Baixa - só ao criar |
| `/Product/{id}` | PUT | Editar produto | Baixa - só ao editar |

---

## 🚀 **Sugestões para Otimização Futura**

### **Endpoints recomendados (não implementados no frontend atual):**
```typescript
GET /Product/{id}     // Buscar produto específico
DELETE /Product/{id}  // Deletar produto (botão não existe no frontend)
```

### **Paginação (não implementada):**
```typescript
GET /Product?page=1&limit=20&search=termo
```

### **Filtros/Busca (não implementados):**
```typescript
GET /Product?category=eletrônicos&minPrice=100&maxPrice=500
```

---

## 🎯 **Prioridades de Implementação**

### **🔴 CRÍTICO - Sistema não funciona sem:**
1. `GET /Product` - Lista produtos
2. `POST /Product` - Criar produtos
3. `PUT /Product/{id}` - Editar produtos

### **🟡 FUTURO - Melhorias:**
4. `GET /Product/{id}` - Busca específica (otimização)
5. `DELETE /Product/{id}` - Deletar produtos
6. Sistema de autenticação real
7. Paginação e filtros

---

## 📝 **Notas Técnicas**

- **CORS**: Frontend roda em porta diferente, configure CORS no backend
- **Content-Type**: Sempre `application/json` nas requisições POST/PUT
- **Encoding**: UTF-8 para suportar caracteres especiais em nomes/descrições
- **Decimal**: Use precisão adequada para preços (ex: decimal(10,2))

---

**Desenvolvido para:** Sistema de Estoque - Microserviços E-Commerce  
**Versão da API:** v1  
**Última atualização:** $(date)
