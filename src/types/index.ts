import {FirebaseAuthTypes} from '@react-native-firebase/auth';

export interface INearbyUser {
  uuid: string;
  location?: {lat: number; long: number};
  distance: number;
  createdAt?: any;
  updatedAt?: any;
}

export interface IOnScanResult {
  txPower?: number;
  rssi: number;
  deviceId: string;
}

export interface IUser extends FirebaseAuthTypes.User {
  uuid: string;
}
