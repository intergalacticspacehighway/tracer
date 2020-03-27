import {format} from 'date-fns';
import {PermissionsAndroid, Platform} from 'react-native';

export const formatTimestamp = (timestamp: number) => {
  return format(new Date(timestamp), 'do MMM yyyy KK:mm aaaa');
};

export const permissionMiddleWare = async () => {
  if (Platform.OS === 'ios') {
    return true;
  }

  const res = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  );

  const res2 = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
  );

  if (
    res === PermissionsAndroid.RESULTS.GRANTED &&
    res2 === PermissionsAndroid.RESULTS.GRANTED
  ) {
    return true;
  }
};

export function getDistance(rssi: number, txPower: number = 127) {
  if (rssi === 0) {
    return -1.0;
  }

  const ratio = (rssi * 1.0) / txPower;
  if (ratio < 1.0) {
    return Math.pow(ratio, 10);
  } else {
    const accuracy = 0.89976 * Math.pow(ratio, 7.7095) + 0.111;
    return accuracy;
  }
}
