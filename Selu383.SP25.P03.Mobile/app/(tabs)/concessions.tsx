import { useState } from "react";
import { View, Text, FlatList, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

const mockConcessions = [
  { id: 1, name: "Popcorn", price: 5 },
  { id: 2, name: "Soda", price: 3 },
  { id: 3, name: "Candy", price: 2.5 },
];

export default function Concessions() {
  const [cart, setCart] = useState<any[]>([]);
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
  const router = useRouter();

  const updateQuantity = (id: number, delta: number) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max((prev[id] || 0) + delta, 0),
    }));
  };

  const addToCart = (item: any) => {
    const qty = quantities[item.id] || 0;
    if (qty === 0) return;

    setCart((prev) => {
      const updated = [...prev];
      const existing = updated.find((c) => c.id === item.id);
      if (existing) {
        existing.quantity += qty;
      } else {
        updated.push({ ...item, quantity: qty });
      }
      return updated;
    });

    setQuantities((prev) => ({ ...prev, [item.id]: 0 }));
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={mockConcessions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const quantity = quantities[item.id] || 0;

          return (
            <View style={styles.itemBox}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.price}>${item.price.toFixed(2)}</Text>
              <View style={styles.quantityRow}>
                <Pressable onPress={() => updateQuantity(item.id, -1)} style={styles.button}>
                  <Text>-</Text>
                </Pressable>
                <Text style={styles.quantity}>{quantity}</Text>
                <Pressable onPress={() => updateQuantity(item.id, 1)} style={styles.button}>
                  <Text>+</Text>
                </Pressable>
              </View>
              <Pressable onPress={() => addToCart(item)} style={styles.addToCart}>
                <Text>Add to Cart</Text>
              </Pressable>
            </View>
          );
        }}
      />

      {cart.length > 0 && (
        <Pressable
          onPress={() => router.push({ pathname: "/cart-summary", params: { cart: JSON.stringify(cart) } })}
          style={styles.checkout}
        >
          <Text style={styles.checkoutText}>View Cart ({cart.length} items)</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  itemBox: {
    backgroundColor: "#fceda5",
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
  },
  name: { fontSize: 18, fontWeight: "bold" },
  price: { fontSize: 16, marginBottom: 8 },
  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  button: {
    backgroundColor: "#a5b4fc",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
  },
  quantity: { marginHorizontal: 10, fontSize: 16 },
  addToCart: {
    backgroundColor: "#a5b4fc",
    padding: 10,
    alignItems: "center",
    borderRadius: 6,
  },
  checkout: {
    backgroundColor: "#a5b4fc",
    padding: 14,
    marginTop: 12,
    borderRadius: 10,
  },
  checkoutText: {
    color: "#000",
    textAlign: "center",
    fontWeight: "bold",
  },
});
