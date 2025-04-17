// hooks/useColorScheme.ts
import { useColorScheme as _useColorScheme } from "react-native";
import { useState } from "react";

export function useColorScheme() {
  const systemColorScheme = _useColorScheme();
  const [colorScheme, setColorScheme] = useState(systemColorScheme ?? "light");

  return {
    colorScheme,
    setColorScheme,
  };
}
