import { useState, useEffect } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { apiService } from "@/services/api";
import type {
  CreateProductRequest,
  UpdateProductRequest,
} from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Package } from "lucide-react";

export function ProductFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState<CreateProductRequest>({
    name: "",
    description: "",
    price: 0,
    stockQuantity: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProduct, setIsLoadingProduct] = useState(isEditing);
  const [error, setError] = useState("");

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isEditing && id) {
      loadProduct(parseInt(id));
    }
  }, [isEditing, id]);

  const loadProduct = async (productId: number) => {
    setIsLoadingProduct(true);
    setError("");

    try {
      const products = await apiService.getAllProducts();
      const product = products.find((p) => p.id === productId);

      if (product) {
        setFormData({
          name: product.name,
          description: product.description || "",
          price: product.price,
          stockQuantity: product.stockQuantity,
        });
      } else {
        setError("Produto não encontrado");
        navigate("/products");
      }
    } catch (err) {
      setError("Erro ao carregar produto");
      console.error(err);
    } finally {
      setIsLoadingProduct(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!formData.name.trim()) {
      setError("Nome do produto é obrigatório");
      setIsLoading(false);
      return;
    }

    if (formData.price <= 0) {
      setError("Preço deve ser maior que zero");
      setIsLoading(false);
      return;
    }

    if (formData.stockQuantity < 0) {
      setError("Quantidade em estoque não pode ser negativa");
      setIsLoading(false);
      return;
    }

    try {
      if (isEditing && id) {
        await apiService.updateProduct(
          parseInt(id),
          formData as UpdateProductRequest
        );
      } else {
        await apiService.createProduct(formData);
      }
      navigate("/products");
    } catch (err) {
      setError(
        isEditing
          ? "Erro ao atualizar produto. Tente novamente."
          : "Erro ao criar produto. Tente novamente."
      );
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange =
    (field: keyof CreateProductRequest) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value =
        field === "price" || field === "stockQuantity"
          ? parseFloat(e.target.value) || 0
          : e.target.value;

      setFormData((prev) => ({ ...prev, [field]: value }));
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
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Button variant="ghost" asChild className="mb-4">
            <Link to="/products">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para Produtos
            </Link>
          </Button>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            {isEditing ? "Editar Produto" : "Novo Produto"}
          </h2>
          <p className="text-gray-600 mt-2">
            {isEditing
              ? "Edite as informações do produto abaixo."
              : "Preencha as informações do produto abaixo."}
          </p>
        </div>

        <Card className="card-modern">
          <CardHeader className="pb-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
              <CardTitle className="text-xl">
                {isEditing
                  ? "Editar Informações do Produto"
                  : "Informações do Produto"}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {isLoadingProduct ? (
              <div className="flex justify-center items-center py-12">
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
                    Carregando produto...
                  </span>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Nome do Produto *
                  </label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Digite o nome do produto"
                    value={formData.name}
                    onChange={handleInputChange("name")}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium">
                    Descrição
                  </label>
                  <textarea
                    id="description"
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Digite uma descrição para o produto"
                    value={formData.description}
                    onChange={handleInputChange("description")}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="price" className="text-sm font-medium">
                      Preço (R$) *
                    </label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      value={formData.price || ""}
                      onChange={handleInputChange("price")}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="stockQuantity"
                      className="text-sm font-medium"
                    >
                      Quantidade em Estoque *
                    </label>
                    <Input
                      id="stockQuantity"
                      type="number"
                      min="0"
                      placeholder="0"
                      value={formData.stockQuantity || ""}
                      onChange={handleInputChange("stockQuantity")}
                      required
                    />
                  </div>
                </div>

                {error && (
                  <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
                    {error}
                  </div>
                )}

                <div className="flex gap-4 pt-6">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 h-12 btn-modern text-base font-semibold"
                  >
                    {isLoading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                        Salvando...
                      </>
                    ) : isEditing ? (
                      "Atualizar Produto"
                    ) : (
                      "Salvar Produto"
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      navigate(
                        isEditing && id ? `/products/${id}` : "/products"
                      )
                    }
                    disabled={isLoading}
                    className="px-8 h-12 hover:bg-gray-50 transition-all duration-200"
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
