import React from 'react';
import {View, Text, ScrollView} from 'react-native';
import '../../services/index';
import {uniqueId, formatTimestamp} from '../../utils';
import {useNearbyPeopleStore} from '../../store/nearby-people';

function Nearby() {
  const {people} = useNearbyPeopleStore();

  return (
    <View>
      <Text>My uuid: {uniqueId}</Text>
      <ScrollView>
        {Object.keys(people).map(uuid => {
          return (
            <View key={uuid}>
              <Text>{uuid}</Text>
              <Text>{formatTimestamp(people[uuid].timestamp)}</Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

export {Nearby};
