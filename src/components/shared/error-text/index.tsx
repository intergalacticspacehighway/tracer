import React from 'react';
import {StyleSheet} from 'react-native';
import {Text} from 'react-native-paper';
import {colors} from 'theme';

export function ErrorText({message}: {message: string}) {
  return <Text style={styles.textStyle}>{message}</Text>;
}

const styles = StyleSheet.create({
  textStyle: {
    color: colors['red-vivid-800'],
  },
});
