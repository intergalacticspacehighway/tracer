import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  ScrollView,
  Alert,
  Platform,
  StyleSheet,
  NativeModules,
} from 'react-native';
//@ts-ignore
import {BluetoothStatus} from 'react-native-bluetooth-status';
import {BLE} from 'ble';
import {useRecentDetectionsStore, addNearbyUser} from 'store';
import {Text, Button} from 'react-native-paper';
import {getDistance} from 'utils';
import {IOnScanResult, INearbyUser} from 'types';
//@ts-ignore
import {useBluetoothStatus} from 'react-native-bluetooth-status';
import {colors} from 'theme';
import {UserCard} from '../user-card';
import {useUserStore} from 'services';
import {useTranslatedText} from '../shared';
//@ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';

const insertRecord = (e: IOnScanResult) => {
  console.log('on scan result ', e);
  let uuid = e.deviceId;

  if (Platform.OS === 'ios') {
    uuid =
      e.deviceId.substr(0, 8) +
      '-' +
      e.deviceId.substr(8, 4) +
      '-' +
      e.deviceId.substr(12, 4) +
      '-' +
      e.deviceId.substr(16, 4) +
      '-' +
      e.deviceId.substr(20);
  }

  const distance = getDistance(e.rssi, e.txPower);
  let user: INearbyUser = {
    uuid,
    distance: Number(distance.toPrecision(4)),
    updatedAt: new Date(),
    createdAt: new Date(),
  };

  addNearbyUser(user);
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
  const {detections} = useRecentDetectionsStore();
  const [isScaning, setIsScanning] = useState(false);
  const {user} = useUserStore();

  let scanListener = useRef({remove: () => {}});
  let bulkScanListener = useRef({remove: () => {}});
  let emitterSuccessListener = useRef({remove: () => {}});

  const [btStatus, isPending] = useBluetoothStatus();

  useEffect(() => {
    scanListener.current = BLE.addListener('onScanResult', insertRecord);

    bulkScanListener.current = BLE.addListener(
      'onScanResultBulk',
      (e: IOnScanResult[]) => {
        e.forEach(insertRecord);
      },
    );

    emitterSuccessListener.current = BLE.addListener(
      'onBroadcastSuccess',
      () => {
        setIsScanning(true);
      },
    );

    if (!btStatus && !isPending) {
      enableBluetooth();
    }

    return () => {
      scanListener.current.remove();
      bulkScanListener.current.remove();
      emitterSuccessListener.current.remove();
    };
  }, [btStatus, isPending]);

  const startEmittingAndReceiving = () => {
    BLE.startBroadcast();
    BLE.startScanning();
    setInterval(() => {
      NativeModules.Beacon.detectBeacons();
    }, 1000);
  };

  const stopEmitting = () => {
    setIsScanning(false);
    BLE.stopBroadcast();
    BLE.stopScanning();
  };

  const startTrackingText = useTranslatedText('startTracking');
  const stopTrackingText = useTranslatedText('stopTracking');

  return (
    <>
      <View style={styles.container}>
        <View style={styles.idWrapper}>
          <Text style={styles.idText}>
            My Device ID -{' '}
            <MaterialCommunityIcons
              name="account"
              color={colors['cool-grey-800']}
              size={18}
            />
            <Text style={{color: colors['cool-blue-100'], fontWeight: 'bold'}}>
              {user.uuid.substr(24, 12)}
            </Text>
          </Text>
        </View>
        {isScaning ? (
          <Button style={styles.scanButton} onPress={stopEmitting}>
            {stopTrackingText}
          </Button>
        ) : (
          <Button style={styles.scanButton} onPress={startEmittingAndReceiving}>
            {startTrackingText}
          </Button>
        )}
        <ScrollView style={{width: '100%'}}>
          <View>
            {detections.map(user => {
              return <UserCard item={user} key={user.uuid} />;
            })}
          </View>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  scanButton: {
    borderRadius: 100,
    height: 200,
    width: 200,
    borderWidth: 6,
    elevation: 10,
    borderColor: colors['cool-blue-80'],
    backgroundColor: 'white',
    marginTop: 30,
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
  },
  textStyle: {
    fontSize: 16,
    color: colors['cool-black-100'],
    margin: 20,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  idWrapper: {
    backgroundColor: 'white',
    elevation: 2,
    paddingLeft: 15,
    paddingRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    height: 40,
    marginTop: 10,
  },
  idText: {
    color: colors['cool-grey-700'],
    fontWeight: 'bold',
  },
});

export {Nearby};
