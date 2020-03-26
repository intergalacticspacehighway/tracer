import {NativeModules, DeviceEventEmitter} from 'react-native';
import {addNearbyUser} from 'store';

const UUID = 'CDB7950D-73F1-4D4D-8E47-C090502DBD63';

const DISTANCE_THRESHOLD = 5;

NativeModules.Beacon.startScanning(UUID);

export const startScanAndBroadcast = () => {
  NativeModules.Beacon.startBroadcast(UUID);
};

DeviceEventEmitter.addListener('onScanResult', e => {
  console.log('ble scan ', e);
  const distance = getDistance(e.rssi);
  console.log('distance', distance);

  if (distance <= DISTANCE_THRESHOLD) {
    addNearbyUser({uuid: e.uuid});
  }
});

DeviceEventEmitter.addListener('onScanFailed', e => {
  console.log('onScanFailed ', e);
});

DeviceEventEmitter.addListener('onBroadcastSuccess', e => {
  console.log('onBroadcastSuccess', e);
});

DeviceEventEmitter.addListener('onBroadcastFailure', e => {
  console.log('onBroadcastFailure ', e);
});

function getDistance(rssi: number) {
  if (rssi === 0) {
    return -1.0;
  }

  const ratio = (rssi * 1.0) / 127;
  if (ratio < 1.0) {
    return Math.pow(ratio, 10);
  } else {
    const accuracy = 0.89976 * Math.pow(ratio, 7.7095) + 0.111;
    return accuracy;
  }
}
