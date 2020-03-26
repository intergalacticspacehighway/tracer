export interface INearbyUser {
  uuid: string;
  location?: {lat: number; long: number};
  distance: number;
  created_at?: any;
}

export interface IOnScanResult {
  txPower?: number;
  rssi: number;
  deviceId: string;
}
