import { useState } from "react";
import { View, Text, FlatList, Pressable, StyleSheet, Image } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

// Mock concessions with images
const mockConcessions = [
  { id: 1, name: "Popcorn", price: 11.0, image: require("@/assets/images/concessions/popcorn.png") },
  { id: 2, name: "Soda", price: 4.99, image: require("@/assets/images/concessions/soda.png") },
  { id: 3, name: "Fanta", price: 4.99, image: require("@/assets/images/concessions/fanta.png") },
  { id: 4, name: "Doritos", price: 4.99, image: require("@/assets/images/concessions/doritos.png") },
  { id: 5, name: "Candy", price: 3.99, image: require("@/assets/images/concessions/candy.png") },
];

export default function Concessions() {
  const router = useRouter();
  const { selectedSeats, movieTitle, theaterName, time, scheduleId } = useLocalSearchParams();

  const [cart, setCart] = useState<any[]>([]);
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});

  const updateQuantity = (id: number, delta: number) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max((prev[id] || 0) + delta, 0),
    }));
  };

  const addToCart = (item: any) => {
    const qty = quantities[item.id] || 0;
    if (qty === 0) return;

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((c) => c.id === item.id);
      if (existingIndex !== -1) {
        const updatedCart = [...prevCart];
        updatedCart[existingIndex].quantity += qty;
        return updatedCart;
      } else {
        return [...prevCart, { ...item, quantity: qty }];
      }
    });
    
    // ✅ Only reset the quantity **AFTER** cart has been updated:
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [item.id]: 0,
    }));
  }
    

  return (
    <View style={styles.container}>
      <FlatList
        data={mockConcessions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const quantity = quantities[item.id] || 0;
          return (
            <View style={styles.itemBox}>
              <Image source={item.image} style={styles.image} />
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
          onPress={() =>
            router.push({
              pathname: "/checkout",
              params: {
                concessions: JSON.stringify(cart),
                selectedSeats: selectedSeats || "[]",
                movieTitle: movieTitle || "",
                theaterName: theaterName || "",
                time: time || "",
                scheduleId: scheduleId || "",
              },
            })
          }
          style={styles.checkout}
        >
          <Text style={styles.checkoutText}>Proceed to Checkout ({cart.length} items)</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#a5b4fc" },
  itemBox: {
    backgroundColor: "#fceda5",
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    alignItems: "center",
  },
  image: {
    width: 250,
    height: 250,
    resizeMode: "contain",
    marginBottom: 10,
  },
  name: { fontSize: 20, fontWeight: "bold", color: "#000" },
  price: { fontSize: 18, marginBottom: 8, color: "#000" },
  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  button: {
    backgroundColor: "#a5b4fc",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
  },
  quantity: { marginHorizontal: 10, fontSize: 18, color: "#000", fontWeight: "bold" },
  addToCart: {
    backgroundColor: "#a5b4fc",
    padding: 12,
    alignItems: "center",
    borderRadius: 6,
    marginTop: 6,
  },
  checkout: {
    backgroundColor: "#fceda5",
    padding: 14,
    marginTop: 12,
    borderRadius: 10,
  },
  checkoutText: {
    color: "#000",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
});