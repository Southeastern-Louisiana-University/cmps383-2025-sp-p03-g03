import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

// 🧾 Define cart item type
type CartItem = {
  id: number;
  name: string;
  quantity: number;
  price: number;
};

// 🧪 Replace this with real data when API works
const initialCart: CartItem[] = [
  { id: 1, name: "Popcorn", quantity: 2, price: 5.0 },
  { id: 2, name: "Soda", quantity: 1, price: 3.0 },
];

export default function CartSummary() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCart);

  const updateQuantity = (id: number, delta: number) => {
    setCartItems((prev: CartItem[]) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(item.quantity + delta, 0) }
          : item
      )
    );
  };

  const deleteItem = (id: number) => {
    setCartItems((prev: CartItem[]) => prev.filter((item) => item.id !== id));
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🛒 Cart Summary</Text>

      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemText}>{item.name}</Text>
              <View style={styles.quantityRow}>
                <Pressable
                  onPress={() => updateQuantity(item.id, -1)}
                  style={styles.qtyBtn}
                >
                  <Text style={styles.qtyText}>-</Text>
                </Pressable>
                <Text style={styles.quantity}>{item.quantity}</Text>
                <Pressable
                  onPress={() => updateQuantity(item.id, 1)}
                  style={styles.qtyBtn}
                >
                  <Text style={styles.qtyText}>+</Text>
                </Pressable>
              </View>
            </View>
            <View style={styles.rightSection}>
              <Text style={styles.itemText}>
                ${(item.price * item.quantity).toFixed(2)}
              </Text>
              <Pressable onPress={() => deleteItem(item.id)}>
                <Ionicons name="trash-outline" size={22} color="#000" />
              </Pressable>
            </View>
          </View>
        )}
      />

      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Total:</Text>
        <Text style={styles.totalPrice}>${total.toFixed(2)}</Text>
      </View>

      <Pressable style={styles.checkoutBtn}>
        <Text style={styles.checkoutText}>Proceed to Checkout</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#a5b4fc",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 20,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fceda5",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    alignItems: "center",
  },
  itemInfo: {
    flex: 1,
  },
  itemText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 6,
  },
  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  qtyBtn: {
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    marginHorizontal: 6,
  },
  qtyText: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#000",
  },
  quantity: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  rightSection: {
    alignItems: "flex-end",
    gap: 6,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    paddingTop: 10,
    borderTopWidth: 2,
    borderTopColor: "#000",
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  checkoutBtn: {
    backgroundColor: "#fceda5",
    marginTop: 24,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  checkoutText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
  },
});
