import React from 'react'; 

import { View, ViewProps } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

type Props = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({ style, lightColor, darkColor, ...otherProps }: Props) {
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    'background'
  );

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
