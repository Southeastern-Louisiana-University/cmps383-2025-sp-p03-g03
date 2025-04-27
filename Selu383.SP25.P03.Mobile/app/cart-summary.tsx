import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import theme from "@/styles/theme"; 

type CartItem = {
  id: number;
  name: string;
  quantity: number;
  price: number;
};

export default function CartSummary() {
  const router = useRouter();
  const { cart } = useLocalSearchParams();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    if (cart) {
      try {
        const parsedCart = JSON.parse(cart as string);
        setCartItems(parsedCart);
      } catch (error) {
        console.error("Failed to parse cart data:", error);
      }
    }
  }, [cart]);

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

      {cartItems.length === 0 ? (
        <Text style={styles.emptyText}>Your cart is empty.</Text>
      ) : (
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
                  <Ionicons name="trash-outline" size={22} color={theme.colors.text} />
                </Pressable>
              </View>
            </View>
          )}
        />
      )}

      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Total:</Text>
        <Text style={styles.totalPrice}>${total.toFixed(2)}</Text>
      </View>

      {cartItems.length > 0 && (
        <Pressable
          style={styles.checkoutBtn}
          onPress={() =>
            router.push({
              pathname: "/checkout",
              params: { concessions: JSON.stringify(cartItems) },
            })
          }
        >
          <Text style={styles.checkoutText}>Proceed to Checkout</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,           
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.colors.text,                           
    marginBottom: 20,
  },
  emptyText: {
    textAlign: "center",
    fontSize: 18,
    color: theme.colors.text,                           
    marginTop: 50,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: theme.colors.notification,         
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    alignItems: "center",
  },
  itemInfo: { flex: 1 },
  itemText: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.colors.text,                           
    marginBottom: 6,
  },
  quantityRow: { flexDirection: "row", alignItems: "center" },
  qtyBtn: {
    backgroundColor: theme.colors.card,                 
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    marginHorizontal: 6,
  },
  qtyText: {
    fontWeight: "bold",
    fontSize: 16,
    color: theme.colors.text,                           
  },
  quantity: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.colors.text,                           
  },
  rightSection: { alignItems: "flex-end", gap: 6 },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    paddingTop: 10,
    borderTopWidth: 2,
    borderTopColor: theme.colors.text,                  
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.text,                           
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.text,                           
  },
  checkoutBtn: {
    backgroundColor: theme.colors.notification,         
    marginTop: 24,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  checkoutText: {
    color: theme.colors.text,                           
    fontWeight: "bold",
    fontSize: 16,
  },
});
