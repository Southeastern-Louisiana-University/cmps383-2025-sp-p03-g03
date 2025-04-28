import { useEffect, useState } from "react";
import { useCart } from "../components/CartContext";
import { PiShoppingCartBold } from "react-icons/pi";

type Product = {
  id: number;
  name: string;
  isActive: boolean;
  theaterId: number;
  productTypeId: number;
  productTypeName: string;
  imageData: string | null;
  imageType: string | null;
  price: number;
  productType: {
    id: number;
    name: string;
  };
};

export default function ConcessionsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [addedProductIds, setAddedProductIds] = useState<number[]>([]);
  const concessionsUrl = "/api/Product";
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchConcessions = async () => {
      try {
        const response = await fetch(concessionsUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch concessions");
        }
        const data: Product[] = await response.json();
        setProducts(Array.isArray(data) ? data.filter((p) => p.isActive) : []);
      } catch (error) {
        console.error("Error fetching concessions:", error);
        setError(
          error instanceof Error ? error.message : "An unknown error occurred"
        );
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchConcessions();
  }, []);

  const groupedConcessions = products.reduce<Record<string, Product[]>>(
    (groups, product) => {
      const typeName = product.productType.name || "Other";
      if (!groups[typeName]) {
        groups[typeName] = [];
      }
      groups[typeName].push(product);
      return groups;
    },
    {}
  );

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      type: "concession",
    });
    setAddedProductIds((prev) => [...prev, product.id]);
  };

  const currentYear = new Date().getFullYear();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="text-xl animate-pulse">Loading Concessions...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="text-center">
          <div className="text-2xl text-red-500 font-bold">Error</div>
          <p className="mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="w-full py-8 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-indigo-300 tracking-wide drop-shadow-lg">
          Concessions Menu
        </h1>
      </div>

      {/* Grid for Concessions */}
      <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6 md:p-10 lg:p-12 max-w-7xl mx-auto">
        {Object.entries(groupedConcessions).map(([typeName, items]) => (
          <div key={typeName} className="col-span-full">
            <h2 className="text-2xl font-extrabold text-indigo-300 mb-6 drop-shadow-lg">
              {typeName}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {items.map((product) => {
                const isAdded = addedProductIds.includes(product.id);
                return (
                  <div
                    key={product.id}
                    className="group flex flex-col items-center gap-3 transition-all duration-300 hover:scale-105"
                  >
                    {/* Product Container */}
                    <div className="relative w-full max-w-[250px] rounded-lg overflow-hidden outline-3 outline-indigo-300 shadow-lg shadow-indigo-950/50 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-indigo-800/70">
                      {product.imageData ? (
                        <>
                          <img
                            src={`data:${product.imageType};base64,${product.imageData}`}
                            alt={product.name}
                            className={`w-full h-auto aspect-[2/3] object-cover transition-all duration-300 ${
                              isAdded ? "blur-sm" : "group-hover:blur-sm"
                            }`}
                            loading="lazy"
                            onError={(
                              e: React.SyntheticEvent<HTMLImageElement, Event>
                            ) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "path/to/fallback-image.jpg";
                            }}
                          />
                          <div
                            className={`absolute inset-0 flex flex-col items-center justify-center bg-gray-900/80 transition-opacity duration-300 ${
                              isAdded
                                ? "opacity-100"
                                : "opacity-0 group-hover:opacity-100"
                            }`}
                          >
                            <p className="text-indigo-300 font-bold text-lg! md:text-base px-4">
                              ${product.price.toFixed(2)}
                            </p>
                            <button
                              onClick={() => handleAddToCart(product)}
                              disabled={isAdded}
                              className={`mt-4 flex items-center gap-2 bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer ${
                                isAdded
                                  ? "opacity-50 cursor-not-allowed"
                                  : "hover:bg-indigo-600"
                              }`}
                            >
                              <PiShoppingCartBold className="h-4 w-4" />
                              <span>{isAdded ? "Added!" : "Add to Cart"}</span>
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className="w-full h-[375px] bg-gray-800 flex items-center justify-center rounded-lg border border-indigo-700">
                          <span className="text-indigo-300 font-medium">
                            No Image Available
                          </span>
                        </div>
                      )}
                    </div>
                    <h3 className="text-lg md:text-xl font-semibold text-indigo-200 text-center transition-colors duration-300 group-hover:text-indigo-100">
                      {product.name}
                    </h3>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
        {products.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-indigo-300 text-lg">
              No concessions available at this time.
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="w-full bg-indigo-800 text-white py-6">
        <div className="container mx-auto px-4 text-center">
          <p>© {currentYear} Lion's Den Cinemas. All rights reserved.</p>
          <div className="mt-2 space-x-4">
            <a href="/terms" className="hover:text-indigo-300">
              Terms
            </a>
            <a href="/privacy" className="hover:text-indigo-300">
              Privacy
            </a>
            <a href="/contact" className="hover:text-indigo-300">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
