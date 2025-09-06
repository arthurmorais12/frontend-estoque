import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { apiService } from "@/services/api";
import type { Product } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Plus, Package, DollarSign, Hash } from "lucide-react";

export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const data = await apiService.getAllProducts();
      setProducts(data);
    } catch (err) {
      setError("Erro ao carregar produtos");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gradient-modern">
      {/* Header */}
      <header className="bg-white/80 backdrop-filter backdrop-blur-lg shadow-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Package className="h-6 w-6 text-white" />
              </div>
              <h1 className="ml-3 text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Sistema de Estoque
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700 font-medium">
                Olá, {user?.name}
              </span>
              <Button
                variant="outline"
                onClick={logout}
                className="border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
              >
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Produtos
            </h2>
            <p className="text-gray-600 mt-1">
              Gerencie seu inventário de produtos
            </p>
          </div>
          <Button asChild className="btn-modern">
            <Link to="/products/new">
              <Plus className="h-4 w-4 mr-2" />
              Novo Produto
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <div className="flex items-center space-x-3">
              <svg
                className="animate-spin h-6 w-6 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span className="text-gray-700 font-medium">
                Carregando produtos...
              </span>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <div className="card-modern p-8 max-w-md mx-auto">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Erro ao carregar
              </h3>
              <p className="text-gray-600 mb-6">{error}</p>
              <Button onClick={loadProducts} className="btn-modern">
                Tentar Novamente
              </Button>
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <div className="card-modern p-12 max-w-md mx-auto">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Nenhum produto encontrado
              </h3>
              <p className="text-gray-600 mb-8">
                Comece adicionando seu primeiro produto ao estoque.
              </p>
              <Button asChild className="btn-modern">
                <Link to="/products/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Produto
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="card-modern">
            <div className="overflow-hidden">
              {/* Header da lista */}
              <div className="border-b border-gray-200 bg-gray-50/50 px-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center text-sm font-medium text-gray-600">
                  <div className="md:col-span-1">Status</div>
                  <div className="md:col-span-4">Produto</div>
                  <div className="md:col-span-2">Preço</div>
                  <div className="md:col-span-2">Estoque</div>
                  <div className="md:col-span-3">Ações</div>
                </div>
              </div>

              {/* Lista de produtos */}
              <div className="divide-y divide-gray-100">
                {products.map((product, index) => (
                  <div
                    key={product.id}
                    className="px-6 py-4 hover:bg-gray-50/50 transition-colors animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                      {/* Status do estoque */}
                      <div className="md:col-span-1 flex items-center">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            product.stockQuantity > 10
                              ? "bg-green-400"
                              : product.stockQuantity > 0
                              ? "bg-yellow-400"
                              : "bg-red-400"
                          }`}
                          title={
                            product.stockQuantity > 10
                              ? "Em estoque"
                              : product.stockQuantity > 0
                              ? "Estoque baixo"
                              : "Sem estoque"
                          }
                        ></div>
                      </div>

                      {/* Nome e descrição do produto */}
                      <div className="md:col-span-4">
                        <div className="font-semibold text-gray-900 text-base mb-1">
                          {product.name}
                        </div>
                        {product.description && (
                          <div className="text-sm text-gray-600 line-clamp-2">
                            {product.description}
                          </div>
                        )}
                      </div>

                      {/* Preço */}
                      <div className="md:col-span-2">
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-1 text-green-500 md:hidden" />
                          <span className="font-bold text-green-600 text-lg">
                            {formatPrice(product.price)}
                          </span>
                        </div>
                      </div>

                      {/* Estoque */}
                      <div className="md:col-span-2">
                        <div className="flex items-center">
                          <Hash className="h-4 w-4 mr-1 text-blue-500 md:hidden" />
                          <span
                            className={`font-bold text-base mr-1 ${
                              product.stockQuantity > 10
                                ? "text-green-600"
                                : product.stockQuantity > 0
                                ? "text-yellow-600"
                                : "text-red-600"
                            }`}
                          >
                            {product.stockQuantity}
                          </span>
                          <span className="text-gray-500 text-sm">un.</span>
                        </div>
                      </div>

                      {/* Ações */}
                      <div className="md:col-span-3">
                        <Button
                          variant="outline"
                          size="sm"
                          className="hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all duration-200"
                          onClick={() => navigate(`/products/${product.id}`)}
                        >
                          Ver Detalhes
                          <svg
                            className="w-4 h-4 ml-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
