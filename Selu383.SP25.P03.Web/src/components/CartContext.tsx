import { createContext, useContext, useEffect, useState } from "react";

export type CartItemType = "seat" | "concession";

interface BaseCartItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
  type: CartItemType;
}
//made this more complex so that when navigating to the checkout page it will have the movie selections that it is looking for in case the user decides to go to the concessions page before checkout.
//for whatever reason you bozos were assuming the user would only navigate to checkout from the darn seat selection screen. WHY?
export interface SeatCartItem extends BaseCartItem {
  type: "seat";
  row: string;
  seatNumber: number;
  seatTypeId: number;
  showtime: {
    id: number;
    time: string;
  };
  movie: {
    id: number;
    title: string;
    runtime: number;
    ageRating: string;
  };
  theater: {
    id: number;
    name: string;
  };
  poster?: {
    imageType: string;
    imageData: string;
  };
}
//for concessions
export interface ConcessionCartItem extends BaseCartItem {
  type: "concession";
}

export type CartItem = SeatCartItem | ConcessionCartItem;

type CartContextType = {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const existing = prev.find(
        (i) => i.id === item.id && i.type === item.type
      );
      if (existing) {
        // Increase quantity if it's the same item (only for concessions probably)
        return prev.map((i) =>
          i.id === item.id && i.type === item.type
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      } else {
        return [...prev, item];
      }
    });
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
