import React, {useState} from 'react';
import {View, Text, ScrollView, TextInput, Button} from 'react-native';
import '../../services/index';
import {uniqueId, formatTimestamp} from '../../utils';
import {useNearbyPeopleStore} from '../../store/nearby-people';
import {startScanAndBroadcast} from '../../services/index';

function Nearby() {
  const {people} = useNearbyPeopleStore();
  const [id, setId] = useState('');

  const startProcess = () => {
    startScanAndBroadcast(id);
  };

  return (
    <View>
      <Text>My uuid: {uniqueId}</Text>
      <TextInput onChangeText={text => setId(text)} />
      <Button onPress={startProcess} title="Connect"></Button>

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
