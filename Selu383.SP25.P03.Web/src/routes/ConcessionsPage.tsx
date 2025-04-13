import { useEffect, useState } from "react";

type Product = {
  id: number;
  name: string;
  isActive: boolean;
  theaterId: number;
  // price?: number;
  // imageUrl?: string;
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
          throw new Error("Failed fetching concessions");
        }
        const data: Product[] = await response.json();
        setProducts(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  const handleAddToCart = (product: Product) => {
    setCart((prevCart) => [...prevCart, product]);
    console.log(`Added to cart: ${product.name}`);
    if (cart == null) {
      alert("failed to add to cart");
    }
  };

  return (
    <div className="px-4 py-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Concessions</h1>
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="border rounded-xl shadow-md overflow-hidden bg-white flex flex-col"
          >
            <img
              src="https://via.placeholder.com/300x200"
              alt={product.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4 flex-grow">
              <h2 className="text-lg font-semibold">{product.name}</h2>
              <p className="text-gray-600 mt-1 mb-3">$4.99</p>
            </div>
            <div className="p-4 pt-0">
              <button onClick={() => handleAddToCart(product)}>
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
