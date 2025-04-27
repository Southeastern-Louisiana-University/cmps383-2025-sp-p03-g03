import { useEffect, useState } from "react";
import { View, Text, FlatList, Pressable, StyleSheet, Image, ActivityIndicator } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { getConcessions, Product } from "@/services/concessionService";
import theme from "@/styles/theme";

export default function Concessions() {
  const router = useRouter();
  const { selectedSeats, movieTitle, theaterName, time, scheduleId } = useLocalSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<any[]>([]);
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadConcessions = async () => {
      const data = await getConcessions();
      setProducts(data.filter((p) => p.isActive));
      setLoading(false);
    };
    loadConcessions();
  }, []);

  const updateQuantity = (id: number, delta: number) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max((prev[id] || 0) + delta, 0),
    }));
  };

  const addToCart = (item: Product) => {
    const qty = quantities[item.id] || 0;
    if (qty === 0) return;

    const price = 4.99;

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((c) => c.id === item.id);
      if (existingIndex !== -1) {
        const updatedCart = [...prevCart];
        updatedCart[existingIndex].quantity += qty;
        return updatedCart;
      } else {
        return [...prevCart, { ...item, quantity: qty, price }];
      }
    });

    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [item.id]: 0,
    }));
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const quantity = quantities[item.id] || 0;
          const price = 4.99;
          return (
            <View style={styles.itemBox}>
              <Image
                source={require("@/assets/images/concessions/fallback.png")}
                style={styles.image}
              />
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.price}>${price.toFixed(2)}</Text>
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
  container: { flex: 1, padding: 16, backgroundColor: theme.colors.background },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: theme.colors.background },
  itemBox: { backgroundColor: theme.colors.notification, padding: 16, borderRadius: 10, marginBottom: 12, alignItems: "center" },
  image: { width: 250, height: 250, resizeMode: "contain", marginBottom: 10 },
  name: { fontSize: 20, fontWeight: "bold", color: "#000" },
  price: { fontSize: 18, marginBottom: 8, color: "#000" },
  quantityRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  button: { backgroundColor: theme.colors.primary, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 4 },
  quantity: { marginHorizontal: 10, fontSize: 18, color: "#000", fontWeight: "bold" },
  addToCart: { backgroundColor: theme.colors.primary, padding: 12, alignItems: "center", borderRadius: 6, marginTop: 6 },
  checkout: { backgroundColor: theme.colors.notification, padding: 14, marginTop: 12, borderRadius: 10 },
  checkoutText: { color: "#000", textAlign: "center", fontWeight: "bold", fontSize: 16 },
});
