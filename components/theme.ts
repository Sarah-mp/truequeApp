import { DefaultTheme } from 'react-native-paper';

export const lightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#153dda',
    background: '#ffffff',
    surface: '#ffffff',
    text: '#000000',
    placeholder: '#888',
    onSurface: '#000000',
  },
};