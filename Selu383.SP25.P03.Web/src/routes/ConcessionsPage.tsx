import { useEffect, useState } from "react";

type Product = {
  id: number;
  name: string;
  isActive: boolean;
  theaterId: number;
  productTypeId: number;
  productTypeName: string;
  imageData: string | null;
  imageType: string | null;
  productType: {
    id: number;
    name: string;
  };
};

export default function ConcessionsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<Product[]>([]); // cart state
  const concessionsUrl = "/api/Product";

  useEffect(() => {
    fetch(concessionsUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("error fetching concessions");
        }
        const data: Product[] = await response.json();
        setProducts(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
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
    setCart((prevCart) => [...prevCart, product]);
    console.log(`Added to cart: ${product.name}`);
    if (cart == null) {
      alert("failed to add to cart");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <h1 className="text-center text-4xl sm:text-5xl md:text-6xl font-extrabold text-indigo-300 tracking-wide drop-shadow-lg">
        Menu
      </h1>
      <div className="max-w-7xl mx-auto">
        {Object.entries(groupedConcessions).map(([typeName, items]) => (
          <div key={typeName} className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">{typeName}</h2>
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {items.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col p-4 hover:shadow-lg transition"
                >
                  <div className="h-48 w-full flex items-center justify-center overflow-hidden mb-4">
                    <img
                      src={
                        product.imageData
                          ? `data:${product.imageType};base64,${product.imageData}`
                          : "No Image Found"
                      }
                      alt={product.name}
                      className="object-contain h-full w-full"
                    />
                  </div>
                  <h3 className="text-lg font-bold text-center mb-4 text-gray-900">
                    {product.name}
                  </h3>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="mt-auto bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-400 transition w-full"
                  >
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
