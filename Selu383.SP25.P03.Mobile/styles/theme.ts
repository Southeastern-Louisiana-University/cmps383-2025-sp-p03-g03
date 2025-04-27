import { DefaultTheme, Theme } from '@react-navigation/native';

const theme: Theme = {
  ...DefaultTheme,               
  dark: true,                    
  colors: {
    ...DefaultTheme.colors,      
    background: '#0f172a',
    text: '#e0e7ff',
    card: '#1e293b',
    primary: '#818cf8',
    border: '#334155',
    notification: '#fceda5',
  },
};

export default theme;
