import React from 'react';
import {StyleSheet} from 'react-native';
import {Text} from 'react-native-paper';

export const CustomText = (props: any) => {
  return (
    <Text style={{...styles.text, ...props.style}} {...props}>
      {props.children}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    fontFamily: 'Montserrat-Bold',
  },
});
