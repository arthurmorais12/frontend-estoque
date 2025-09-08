const API_BASE_URL = "http://localhost:5017/api/v1";

export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  stockQuantity: number;
}

export interface CreateProductRequest {
  name: string;
  description?: string;
  price: number;
  stockQuantity: number;
}

export interface UpdateProductRequest {
  name: string;
  description?: string;
  price: number;
  stockQuantity: number;
}

// Backend response interfaces
export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  expiresAt: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  userId: number;
}

export interface User {
  id: number;
  email: string;
  name: string;
  token: string;
}

class ApiService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem("token");
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = token;
    }

    return headers;
  }
  async getAllProducts(): Promise<Product[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/Product`);
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      return response.json();
    } catch (error) {
      console.error("Error fetching products:", error);
      return [];
    }
  }

  async createProduct(product: CreateProductRequest): Promise<Product | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/Product`, {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(product),
      });

      if (!response.ok) {
        throw new Error("Failed to create product");
      }

      // Backend retorna success/message, não o produto diretamente
      const result = await response.json();
      if (result.success) {
        // Recarregar a lista de produtos para pegar o produto criado
        // Por enquanto, retornar um produto mock
        return { ...product, id: Date.now() } as Product;
      }

      return null;
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  }

  async updateProduct(
    id: number,
    product: UpdateProductRequest
  ): Promise<Product | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/Product`, {
        method: "PUT",
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ id, ...product }),
      });

      if (!response.ok) {
        throw new Error("Failed to update product");
      }

      // Backend retorna success/message, não o produto diretamente
      const result = await response.json();
      if (result.success) {
        return { id, ...product } as Product;
      }

      return null;
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  }

  // Real authentication methods
  async login(email: string, password: string): Promise<User | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/Auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data: LoginResponse = await response.json();

      if (data.success && data.token) {
        const user: User = {
          id: 1, // Backend não retorna ID no login, usaremos 1 por padrão
          email,
          name: email.split("@")[0], // Extrair nome do email por enquanto
          token: data.token,
        };

        // Salvar usuário e token
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", data.token);

        return user;
      }

      return null;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  async register(
    name: string,
    email: string,
    password: string
  ): Promise<User | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/Auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nome: name, email, password }),
      });

      if (!response.ok) {
        throw new Error("Registration failed");
      }

      const data: RegisterResponse = await response.json();

      if (data.success) {
        // Após registrar com sucesso, fazer login automaticamente
        return await this.login(email, password);
      }

      return null;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  }

  logout(): void {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }
}

export const apiService = new ApiService();
