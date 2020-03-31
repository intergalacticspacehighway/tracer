import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  ScrollView,
  Alert,
  Platform,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
//@ts-ignore
import {BluetoothStatus} from 'react-native-bluetooth-status';
import {BLE} from 'ble';
import {useRecentDetectionsStore, addNearbyUser} from 'store';
import {Text, Surface} from 'react-native-paper';
import {getDistance} from 'utils';
import {IOnScanResult, INearbyUser} from 'types';
//@ts-ignore
import {useBluetoothStatus} from 'react-native-bluetooth-status';
import {colors, theme} from 'theme';
import {UserCard} from '../user-card';
import {useUserStore, getCurrentUser} from 'services';
import {useTranslatedText, ScreenContainer} from '../shared';
//@ts-ignore

const insertRecord = (e: IOnScanResult) => {
  console.log('on scan result ', e);
  let uuid = e.deviceId;

  // if (Platform.OS === 'ios') {
  //   uuid =
  //     e.deviceId.substr(0, 8) +
  //     '-' +
  //     e.deviceId.substr(8, 4) +
  //     '-' +
  //     e.deviceId.substr(12, 4) +
  //     '-' +
  //     e.deviceId.substr(16, 4) +
  //     '-' +
  //     e.deviceId.substr(20);
  // }

  const distance = getDistance(e.rssi, e.txPower);
  let user: INearbyUser = {
    uuid,
    distance: Number(distance.toPrecision(4)),
    updatedAt: new Date(),
    createdAt: new Date(),
  };

  if (distance <= 5) {
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
  };

  const stopEmitting = () => {
    setIsScanning(false);
    BLE.stopBroadcast();
    BLE.stopScanning();
  };

  const startTrackingText = useTranslatedText('startTracking');
  const stopTrackingText = useTranslatedText('stopTracking');

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <View
          style={{
            ...styles.borderWrapper2,
            borderColor: isScaning
              ? 'rgba(12,161,246, 0.2)'
              : 'rgba(112, 112, 112, 0.1)',
          }}>
          <View
            style={{
              ...styles.borderWrapper1,
              borderColor: isScaning
                ? 'rgba(4,76,157, 0.4)'
                : 'rgba(112, 112, 112, 0.1)',
            }}>
            <Surface style={styles.scanButton}>
              {isScaning ? (
                <TouchableOpacity
                  style={buttonStyle.stopContainer}
                  onPress={stopEmitting}>
                  <Text style={{...buttonStyle.btnlabel, color: 'white'}}>
                    {stopTrackingText}
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={buttonStyle.container}
                  onPress={startEmittingAndReceiving}>
                  <Text style={buttonStyle.btnlabel}>{startTrackingText}</Text>
                </TouchableOpacity>
              )}
            </Surface>
          </View>
        </View>
        <View style={styles.idWrapper}>
          {!isScaning && (
            <View style={styles.alertMessageWrapper}>
              <Text style={styles.stayActive}>Stay Active</Text>
              <Text style={styles.secondaryText}>
                by pressing start button above
              </Text>
            </View>
          )}

          <Text style={styles.idText}>
            ID{' '}
            <Text style={{fontSize: 14, fontFamily: 'Montserrat-Medium'}}>
              {user.uuid.substr(24, 12)}
            </Text>
          </Text>
        </View>
        {isScaning && (
          <View style={{alignItems: 'center', marginTop: 10}}>
            <Text style={styles.nearbyLabel}>Recent Nearby Users</Text>
            <ScrollView style={{width: '100%'}}>
              {detections.map(user => {
                return <UserCard item={user} key={user.uuid} />;
              })}
            </ScrollView>
          </View>
        )}
      </View>
    </ScreenContainer>
  );
}

const buttonStyle = StyleSheet.create({
  btnlabel: {
    fontFamily: 'Montserrat-Bold',
    textTransform: 'uppercase',
    letterSpacing: 4,
    color: theme.colors.primary,
    fontSize: 16,
  },
  container: {
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stopContainer: {
    width: 120,
    height: 120,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    borderRadius: 60,
    justifyContent: 'center',
  },
});

const styles = StyleSheet.create({
  secondaryText: {
    color: theme.colors.accent,
    fontSize: 18,
    fontFamily: 'Montserrat-Medium',
  },
  stayActive: {
    fontFamily: 'Montserrat-Bold',
    color: theme.colors.accent,
    fontSize: 24,
  },
  alertMessageWrapper: {
    marginBottom: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nearbyLabel: {
    color: '#044C9D',
    fontFamily: 'Montserrat-Regular',
    opacity: 0.4,
  },
  borderWrapper2: {
    height: 240,
    width: 240,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 120,
    borderColor: 'rgba(112, 112, 112, 0.1)',
    backgroundColor: 'transparent',
  },
  borderWrapper1: {
    height: 180,
    width: 180,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 90,
    borderColor: 'rgba(112, 112, 112, 0.1)',
    backgroundColor: 'transparent',
  },
  scanButton: {
    borderRadius: 60,
    elevation: 20,
  },
  textStyle: {
    fontSize: 16,
    color: colors['cool-black-100'],
    margin: 20,
  },
  container: {
    flex: 1,
    alignItems: 'center',
  },
  idWrapper: {
    backgroundColor: 'white',
    paddingLeft: 15,
    paddingRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    marginTop: 10,
  },
  idText: {
    color: colors['cool-grey-700'],
    fontFamily: 'Montserrat-Bold',
    fontSize: 14,
  },
});

export {Nearby};
