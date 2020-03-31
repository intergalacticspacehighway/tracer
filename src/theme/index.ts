import color from 'color';
import {DefaultTheme, configureFonts} from 'react-native-paper';
import {colors} from './colors';

console.log('bg color ', DefaultTheme);
export const theme = {
  ...DefaultTheme,
  dark: false,
  roundness: 6,
  colors: {
    ...DefaultTheme.colors,
    background: 'white',
    onSurface: 'white',
    primary: '#044C9D',
    accent: colors['cool-blue-100'],
    text: 'black',
    fonts: configureFonts({
      ios: {
        regular: {
          fontFamily: 'Montserrat-Regular',
          fontWeight: 'normal',
        },
        medium: {
          fontFamily: 'Montserrat-Medium',
          fontWeight: 'normal',
        },
        light: {
          fontFamily: 'Montserrat-Light',
          fontWeight: 'normal',
        },
        thin: {
          fontFamily: 'Montserrat-Light',
          fontWeight: 'normal',
        },
      },
      android: {
        regular: {
          fontFamily: 'Montserrat-Regular',
          fontWeight: 'normal',
        },
        medium: {
          fontFamily: 'Montserrat-Medium',
          fontWeight: 'normal',
        },
        light: {
          fontFamily: 'Montserrat-Light',
          fontWeight: 'normal',
        },
        thin: {
          fontFamily: 'Montserrat-Light',
          fontWeight: 'normal',
        },
      },
    }),
    disabled: color(colors['cool-grey-300'])
      .alpha(0.26)
      .rgb()
      .string(),
    placeholder: color(colors['cool-grey-300'])
      .alpha(0.54)
      .rgb()
      .string(),
  },
};

export {colors};
