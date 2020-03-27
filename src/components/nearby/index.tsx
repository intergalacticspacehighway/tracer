import React, {useEffect, useRef} from 'react';
import {View, ScrollView, Button, Alert, Linking, Platform} from 'react-native';
//@ts-ignore
import {BluetoothStatus} from 'react-native-bluetooth-status';
import {BLE} from 'ble';
import {useNearbyPeopleStore, addNearbyUser} from 'store';
import {Text} from 'react-native-paper';
import {formatTimestamp, getDistance} from 'utils';
import {IOnScanResult, INearbyUser} from 'types';
import {useBluetoothStatus} from 'react-native-bluetooth-status';

const DISTANCE_THRESHOLD = 4;
const insertRecord = (e: IOnScanResult) => {
  const distance = getDistance(e.rssi, e.txPower);
  let user = {
    uuid: e.deviceId,
    distance: Number(distance.toPrecision(4)),
  };
  console.log('onScanResult', e, distance);
  if (distance <= DISTANCE_THRESHOLD) {
    addNearbyUser(user);
  }
};

async function enableBluetooth() {
  if (Platform.OS === 'android') {
    Alert.alert(
      'Enable Bluetooth',
      'Click Okay to go to settings',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Okay',
          onPress: () => BluetoothStatus.enable(),
        },
      ],
      {cancelable: true},
    );
  }
}

function Nearby() {
  const detectedPerson = useNearbyPeopleStore(state => state.person);

  let scanListener = useRef({remove: () => {}});
  let scanStopListener = useRef({remove: () => {}});
  let bulkScanListener = useRef({remove: () => {}});
  const [btStatus, isPending] = useBluetoothStatus();

  useEffect(() => {
    if (!btStatus && !isPending) {
      enableBluetooth();
    }
    if (btStatus) {
      BLE.startBroadcast();
      BLE.startScanning();
    }
  }, [btStatus, isPending]);

  useEffect(() => {
    scanListener.current = BLE.addListener('onScanResult', insertRecord);

    bulkScanListener.current = BLE.addListener(
      'onScanResultBulk',
      (e: IOnScanResult[]) => {
        e.forEach(insertRecord);
      },
    );

    return () => {
      scanListener.current.remove();
      bulkScanListener.current.remove();
    };
  }, []);

  return (
    <View>
      {/* <Button onPress={BLE.startBroadcast} title="Broadcast"></Button>
      <Button onPress={BLE.stopBroadcast} title="Stop broadcast"></Button>

      <Button onPress={BLE.startScanning} title="Scan"></Button>
      <Button onPress={BLE.stopScanning} title="Stop Scan"></Button> */}

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
