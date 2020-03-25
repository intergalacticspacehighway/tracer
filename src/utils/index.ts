import DeviceInfo from 'react-native-device-info';
import {format} from 'date-fns';
let uniqueId = DeviceInfo.getUniqueId();

const formatTimestamp = (timestamp: number) => {
  return format(new Date(timestamp), 'do MMM yyyy KK:mm aaaa');
};

export {uniqueId, formatTimestamp};
