import React from 'react';
import {Card} from 'react-native-paper';
import {View, StyleSheet, Dimensions} from 'react-native';
import {INearbyUser} from 'types';
import {Text} from 'react-native-paper';
import {formatTimestamp} from 'utils';

interface IProps {
  item: INearbyUser;
}

export const UserCard = ({item}: IProps) => {
  const {uuid} = item;

  return (
    <Card style={styles.container}>
      <View style={styles.flexWrapper}>
        <View>
          <Text style={styles.idStyle}>{uuid.substr(24, 12)}</Text>
          <Text style={styles.distance}>{item.distance} metres (approx.)</Text>
        </View>
        <View>
          <Text style={{fontFamily: 'Montserrat-Regular'}}>
            {formatTimestamp(item.updatedAt)}
          </Text>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  flexWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  container: {
    backgroundColor: 'white',
    marginLeft: 16,
    marginRight: 16,
    marginBottom: 6,
    marginTop: 16,
    padding: 20,
    width: Dimensions.get('screen').width - 30,
  },
  idStyle: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 14,
  },
  distance: {
    paddingTop: 10,
    fontFamily: 'Montserrat-Regular',
    fontWeight: '300',
    opacity: 0.7,
  },
  label: {
    fontWeight: 'bold',
  },
  flexRow: {
    flexDirection: 'row',
  },
});
