export interface INearbyUser {
  uuid: string;
  location?: {lat: number; long: number};
  distance: number;
}

export interface IOnScanResult {
  txPower?: number;
  rssi: number;
  deviceId: string;
}
