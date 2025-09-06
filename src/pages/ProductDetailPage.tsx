import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { apiService } from "@/services/api";
import type { Product } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Package, DollarSign, Hash, FileText } from "lucide-react";

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      loadProduct(parseInt(id));
    }
  }, [id]);

  const loadProduct = async (productId: number) => {
    setIsLoading(true);
    try {
      const products = await apiService.getAllProducts();
      const foundProduct = products.find((p) => p.id === productId);

      if (foundProduct) {
        setProduct(foundProduct);
      } else {
        setError("Produto não encontrado");
      }
    } catch (err) {
      setError("Erro ao carregar produto");
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
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Button variant="ghost" asChild className="mb-4">
            <Link to="/products">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para Produtos
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-gray-600">Carregando produto...</div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-600 mb-4">{error}</div>
            <Button onClick={() => navigate("/products")}>
              Voltar para Produtos
            </Button>
          </div>
        ) : product ? (
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">
                  {product.name}
                </h2>
                {product.description && (
                  <p className="text-gray-600 text-lg">{product.description}</p>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    product.stockQuantity > 10
                      ? "bg-green-100 text-green-800"
                      : product.stockQuantity > 0
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {product.stockQuantity > 0 ? "Em Estoque" : "Sem Estoque"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="card-modern">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <DollarSign className="h-5 w-5 mr-2" />
                    Informações Financeiras
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Preço unitário:</span>
                    <span className="text-2xl font-bold text-green-600">
                      {formatPrice(product.price)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">
                      Valor total em estoque:
                    </span>
                    <span className="text-lg font-semibold">
                      {formatPrice(product.price * product.stockQuantity)}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-modern">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Hash className="h-5 w-5 mr-2" />
                    Informações de Estoque
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">
                      Quantidade disponível:
                    </span>
                    <span className="text-2xl font-bold text-blue-600">
                      {product.stockQuantity} unidades
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Status:</span>
                    <span
                      className={`font-semibold ${
                        product.stockQuantity > 10
                          ? "text-green-600"
                          : product.stockQuantity > 0
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {product.stockQuantity > 10
                        ? "Estoque Alto"
                        : product.stockQuantity > 0
                        ? "Estoque Baixo"
                        : "Sem Estoque"}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="card-modern">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Detalhes do Produto
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-600 block">
                      ID do Produto:
                    </span>
                    <span className="text-lg">{product.id}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600 block">
                      Nome:
                    </span>
                    <span className="text-lg">{product.name}</span>
                  </div>
                  {product.description && (
                    <div className="md:col-span-2">
                      <span className="text-sm font-medium text-gray-600 block">
                        Descrição:
                      </span>
                      <p className="text-gray-800 mt-1">
                        {product.description}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button
                asChild
                className="flex-1 btn-modern h-12 text-base font-semibold"
              >
                <Link to="/products/new">Adicionar Novo Produto</Link>
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/products")}
                className="px-8 h-12 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all duration-200"
              >
                Ver Todos os Produtos
              </Button>
              <Button
                variant="outline"
                asChild
                className="px-8 h-12 hover:bg-green-50 hover:border-green-300 hover:text-green-700 transition-all duration-200"
              >
                <Link to={`/products/${product.id}/edit`}>Editar Produto</Link>
              </Button>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}
