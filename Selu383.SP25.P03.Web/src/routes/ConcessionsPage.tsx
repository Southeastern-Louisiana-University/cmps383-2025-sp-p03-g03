import { useEffect, useState } from "react";

type Product = {
  id: number;
  name: string;
  isActive: boolean;
  theaterId: number;
};

export default function ConcessionsPage() {
  const [products, setProducts] = useState<Product[]>([]);
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
  return (
    <div>
      <h1>Concessions</h1>
      <ul>
        {products.map((products) => (
          <li key={products.id}>
            <strong>{products.name}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
}
