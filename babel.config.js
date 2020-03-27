module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        alias: {
          components: './src/components',
          db: './src/db',
          navigators: './src/navigators',
          services: './src/services',
          store: './src/store',
          types: './src/types',
          utils: './src/utils',
          theme: './src/theme',
        },
      },
    ],
    ['@babel/plugin-proposal-decorators', {legacy: true}],
  ],
  env: {
    production: {
      plugins: ['react-native-paper/babel'],
    },
  },
};
