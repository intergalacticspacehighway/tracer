import React, {useEffect, useRef} from 'react';
import {View, ScrollView, Button, Alert} from 'react-native';
//@ts-ignore
import {BluetoothStatus} from 'react-native-bluetooth-status';
import {BLE} from 'ble';
import {useNearbyPeopleStore, addNearbyUser} from 'store';
import {Text} from 'react-native-paper';
import {formatTimestamp, getDistance} from 'utils';
import {IOnScanResult} from 'types';

async function checkBluetoothState() {
  const isEnabled = await BluetoothStatus.state();
  if (!isEnabled) {
    Alert.alert('Enable bluetooth');
  }
  // false
}

function Nearby() {
  const detectedPerson = useNearbyPeopleStore(state => state.person);

  let listener = useRef({remove: () => {}});

  useEffect(() => {
    listener.current = BLE.addListener('onScanResult', (e: IOnScanResult) => {
      const distance = getDistance(e.rssi, e.txPower);
      console.log('onScanResult ', e, distance);
      addNearbyUser({
        uuid: e.deviceId,
        distance: Number(distance.toPrecision(4)),
      });
    });

    checkBluetoothState();

    return listener.current.remove;
  }, []);

  return (
    <View>
      <Button onPress={BLE.startBroadcast} title="Broadcast"></Button>
      <Button onPress={BLE.stopBroadcast} title="Stop broadcast"></Button>

      <Button onPress={BLE.startScanning} title="Scan"></Button>
      <Button onPress={BLE.stopScanning} title="Stop Scan"></Button>

      <ScrollView>
        {detectedPerson.uuid ? (
          <>
            <Text>{detectedPerson.uuid}</Text>
            <Text>Distance:{detectedPerson.distance}</Text>
            <Text>Distance:{formatTimestamp(new Date().getTime())}</Text>
          </>
        ) : null}
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
