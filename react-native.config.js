// react-native.config.js
module.exports = {
  dependencies: {
    'react-native-quiet': {
      platforms: {
        android: null, // disable Android platform, other platforms will still autolink if provided
      },
    },
  },
};
