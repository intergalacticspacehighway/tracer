import {
  NativeModules,
  DeviceEventEmitter,
  NativeEventEmitter,
  Platform,
} from 'react-native';
const UUID = 'CDB7950D-73F1-4D4D-8E47-C090502DBD63';

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
  return NativeModules.Beacon.startBroadcast(UUID);
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
