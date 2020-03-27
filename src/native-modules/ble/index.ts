import {
  NativeModules,
  DeviceEventEmitter,
  DeviceEventEmitterStatic,
} from 'react-native';
const UUID = 'CDB7950D-73F1-4D4D-8E47-C090502DBD63';

type Events =
  | 'onScanResult'
  | 'onScanFailed'
  | 'onBroadcastSuccess'
  | 'onBroadcastFailure';

interface IBLE {
  startBroadcast: () => void;
  stopBroadcast: () => void;
  startScanning: () => void;
  stopScanning: () => void;
  addListener: (on: Events, callback: (e: any) => void) => any;
}

const startScanning = () => {
  return NativeModules.Beacon.startScanning(UUID);
};

const stopScanning = () => {
  return NativeModules.Beacon.stopScanning();
};

const startBroadcast = () => {
  return NativeModules.Beacon.startBroadcast(UUID);
};
const stopBroadcast = () => {
  return NativeModules.Beacon.stopBroadcast();
};

const addListener = (on: Events, callback: (e: any) => void) => {
  const a = DeviceEventEmitter.addListener(on, callback);
  return a;
};

export const BLE: IBLE = {
  ...NativeModules.Beacon,
  startBroadcast,
  startScanning,
  stopScanning,
  stopBroadcast,
  addListener,
};
