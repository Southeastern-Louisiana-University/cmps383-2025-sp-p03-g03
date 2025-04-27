export type Product = {
    id: number;
    name: string;
    isActive: boolean;
    theaterId: number;
    productTypeId: number;
    productTypeName: string;
  };
  
  const API_URL = "https://cmps383-2025-sp25-p03-g03.azurewebsites.net/api/Product";
  
  export async function getConcessions(): Promise<Product[]> {
    try {
      const response = await fetch(API_URL, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch concessions");
      }
  
      const data: Product[] = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching concessions:", error);
      return [];
    }
  }
  