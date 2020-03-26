import React, {useEffect} from 'react';
import {View, Text, ScrollView, Button, Alert} from 'react-native';
import {startScanAndBroadcast} from 'services';
import {Switch} from 'react-native-paper';
//@ts-ignore
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

  const startProcess = () => {
    startScanAndBroadcast();
  };

  return (
    <View>
      <Button onPress={startProcess} title="Connect"></Button>

      <ScrollView>
        {/* {Object.keys(people).map(uuid => {
          return (
            <View key={uuid}>
              <Text>{uuid}</Text>
              <Text>{formatTimestamp(people[uuid].timestamp)}</Text>
            </View>
          );
        })} */}
      </ScrollView>
    </View>
  );
}

export {Nearby};
