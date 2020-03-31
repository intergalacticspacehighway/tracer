import React from 'react';
import {StyleSheet, View} from 'react-native';

function ScreenContainer({children}: any) {
  return <View style={styles.wrapper}>{children}</View>;
}

export {ScreenContainer};
const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: 'white',
    flex: 1,
  },
});
