import React from 'react';
import {Card} from 'react-native-paper';
import {Dimensions, View, StyleSheet} from 'react-native';
import {INearbyUser} from 'types';
import {useTranslatedText} from '../shared';
import {Text} from 'react-native-paper';
import {formatTimestamp} from 'utils';
const {height, width} = Dimensions.get('window');

interface IProps {
  item: INearbyUser;
}

export const UserCard = ({item}: IProps) => {
  const {uuid} = item;
  const distance = useTranslatedText('Distance');
  const date = useTranslatedText('Date');

  return (
    <Card style={{backgroundColor: 'white', margin: 10}}>
      <Card.Title title={uuid.substr(24, 12)} />
      <Card.Content>
        <View style={{flexDirection: 'row'}}>
          <Text style={styles.label}>{distance}: </Text>
          <Text>{item.distance} m (approx.)</Text>
        </View>
        <View style={{flexDirection: 'row'}}>
          <Text style={styles.label}>{date}: </Text>
          <Text>{formatTimestamp(item.updatedAt)}</Text>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    height: height,
    width: width,
    paddingBottom: 120,
  },
  label: {
    fontWeight: 'bold',
  },
});
