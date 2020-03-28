import {
  NativeModules,
  DeviceEventEmitter,
  NativeEventEmitter,
  Platform,
} from 'react-native';
import {getCurrentUserUUID} from 'services';
export const UUID = '848da4e8-0793-5813-8a36-63d7888353f7';

type Events =
  | 'onScanResult'
  | 'onScanResultBulk'
  | 'onScanFailed'
  | 'onBroadcastSuccess'
  | 'onBroadcastFailure'
  | 'onStopScanning'
  | 'onStopBroadcast';

const emitter =
  Platform.OS !== 'android'
    ? new NativeEventEmitter(NativeModules.Beacon)
    : DeviceEventEmitter;

interface IBLE {
  startBroadcast: () => void;
  stopBroadcast: () => void;
  startScanning: () => void;
  stopScanning: () => void;
  getBLEState: () => void;
  addListener: (on: Events, callback: (e: any) => void) => any;
}

const startScanning = () => {
  return NativeModules.Beacon.startScanning(UUID);
};

const startBroadcast = () => {
  const userUUID = getCurrentUserUUID();
  return NativeModules.Beacon.startBroadcast(userUUID);
};

const stopScanning = () => {
  return NativeModules.Beacon.stopScanning();
};

const stopBroadcast = () => {
  return NativeModules.Beacon.stopBroadcast();
};

const addListener = (on: Events, callback: (e: any) => void) => {
  const a = emitter.addListener(on, callback);
  return a;
};

export const BLE: IBLE = {
  ...NativeModules.Beacon,
  startBroadcast,
  startScanning,
  addListener,
  stopScanning,
  stopBroadcast,
};
