import color from 'color';
import {DefaultTheme} from 'react-native-paper';
import {colors} from './colors';
export const theme = {
  ...DefaultTheme,
  dark: false,
  roundness: 6,
  colors: {
    ...DefaultTheme.colors,
    primary: colors['cool-blue-100'],
    accent: colors['cool-blue-80'],
    text: 'black',
    disabled: color(colors['cool-grey-300'])
      .alpha(0.26)
      .rgb()
      .string(),
    placeholder: color(colors['cool-grey-300'])
      .alpha(0.54)
      .rgb()
      .string(),
    backdrop: color(colors['cool-grey-300'])
      .alpha(0.5)
      .rgb()
      .string(),
  },
};

export {colors};
