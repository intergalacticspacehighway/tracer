import DeviceInfo from 'react-native-device-info';
import {format} from 'date-fns';
import {PermissionsAndroid, Platform} from 'react-native';
let uniqueId = DeviceInfo.getUniqueId();

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
