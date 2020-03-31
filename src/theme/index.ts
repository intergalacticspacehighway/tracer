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
    accent: '#0CA1F6',
    text: 'black',
    disabled: color(colors['cool-grey-300'])
      .alpha(0.26)
      .rgb()
      .string(),
    placeholder: color(colors['cool-grey-300'])
      .alpha(0.54)
      .rgb()
      .string(),
  },
  fonts: configureFonts({
    default: {
      regular: {
        fontFamily: '`Montserrat`-Regular',
        fontWeight: '400',
      },
      medium: {
        fontFamily: 'Montserrat-Medium',
        fontWeight: '500',
      },
      light: {
        fontFamily: 'Montserrat-Light',
        fontWeight: '300',
      },
      thin: {
        fontFamily: 'Montserrat-Light',
        fontWeight: '300',
      },
    },
  }),
};

export {colors};
