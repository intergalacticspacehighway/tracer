import React, {useEffect} from 'react';
import {View, Text, ScrollView, TextInput, Button, Alert} from 'react-native';
import {uniqueId, formatTimestamp} from '../../utils';
import {useNearbyPeopleStore} from '../../store/nearby-people';
import {startScanAndBroadcast} from '../../services/index';
import {Switch} from 'react-native-paper';
import {BluetoothStatus} from 'react-native-bluetooth-status';
async function checkBluetoothState() {
  const isEnabled = await BluetoothStatus.state();
  if (!isEnabled) {
    Alert.alert('Enable bluetooth');
  }
  // false
}

function Nearby() {
  useEffect(() => {
    checkBluetoothState();
  }, []);
  const {people} = useNearbyPeopleStore();

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
