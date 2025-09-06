const API_BASE_URL = "http://localhost:5062/api/v1";

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

// Mock user for authentication (since there's no auth backend)
export interface User {
  id: string;
  email: string;
  name: string;
}

class ApiService {
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });

      if (!response.ok) {
        throw new Error("Failed to create product");
      }

      return response.json();
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
      const response = await fetch(`${API_BASE_URL}/Product/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });

      if (!response.ok) {
        throw new Error("Failed to update product");
      }

      return response.json();
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  }

  // Mock authentication methods
  async login(email: string, password: string): Promise<User | null> {
    // Mock authentication - in a real app, this would call an authentication API
    if (email && password) {
      const user = {
        id: "1",
        email,
        name: email.split("@")[0],
      };
      localStorage.setItem("user", JSON.stringify(user));
      return user;
    }
    return null;
  }

  async register(
    name: string,
    email: string,
    password: string
  ): Promise<User | null> {
    // Mock registration - in a real app, this would call a registration API
    if (name && email && password) {
      const user = {
        id: Date.now().toString(),
        email,
        name,
      };
      localStorage.setItem("user", JSON.stringify(user));
      return user;
    }
    return null;
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  }

  logout(): void {
    localStorage.removeItem("user");
  }
}

export const apiService = new ApiService();
