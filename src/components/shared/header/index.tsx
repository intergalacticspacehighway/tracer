import {View, StyleSheet} from 'react-native';
import React from 'react';
import {Text} from 'react-native-paper';

const Header = () => {
  return (
    <View style={styles.wrapper}>
      <Text>eFight</Text>
      <View>
        <Text>eFight</Text>
      </View>
    </View>
  );
};

export {Header};

const styles = StyleSheet.create({
  wrapper: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingLeft: 18,
    paddingRight: 18,
  },
});
