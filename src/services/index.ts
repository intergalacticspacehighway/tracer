//@ts-ignore
import Geolocation from '@react-native-community/geolocation';
import {NativeModules, DeviceEventEmitter} from 'react-native';
import {addNearbyUser} from '../store/nearby-people';
import {uniqueId} from '../utils';

const UUID = 'CDB7950D-73F1-4D4D-8E47-C090502DBD63';
console.log('native modules ', NativeModules.Beacon.startScanning(UUID));

export const startScanAndBroadcast = (id: string) => {
  NativeModules.Beacon.startBroadcast(UUID);
};

let listener = DeviceEventEmitter.addListener('onBleScan', e => {
  console.log('ble scan ', e);
  const dis = getDistance(e.rssi);
  console.log('diss ', dis);
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

// // Distance threshold in meter
// const DISTANCE_THRESHOLD = 10;
// let myLocation: any = null;
// async function watchMyPosition() {
//   const granted = await PermissionsAndroid.request(
//     PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//     {
//       title: 'Location Permission',
//       message:
//         'This App needs access to your location ' +
//         'so we can know where you are.',
//     },
//   );

//   if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//     console.log('Watching location');
//     Geolocation.watchPosition(
//       data => {
//         myLocation = data;
//         nearbyAPI.publish(JSON.stringify({...myLocation, uuid: uniqueId}));
//       },
//       (error: any) => {
//         console.log('error while watching location ', error);
//       },
//       {
//         enableHighAccuracy: true,
//         showLocationDialog: true,
//         forceRequestLocation: true,
//         distanceFilter: 1,
//         interval: 3000,
//       },
//     );
//   } else {
//     console.log('Location permission denied');
//   }
// }

// nearbyAPI.onSubscribeSuccess(async () => {
//   watchMyPosition();
//   console.log('subscribe success');
// });

// nearbyAPI.onFound(message => {
//   console.log('Message Found!', message);
//   onMessage(message);
// });

// nearbyAPI.onLost(message => {
//   console.log('Message Lost!');
//   onMessage(message);
// });

// ////

// /// Not needed

// nearbyAPI.onConnected(async message => {
//   nearbyAPI.subscribe();
//   console.log('connected ', message);
// });

// nearbyAPI.onDisconnected(message => {
//   console.log(message);
// });

// nearbyAPI.onDistanceChanged((message, value) => {
//   console.log('Distance Changed!');
//   console.log(message, value);
// });

// nearbyAPI.onPublishSuccess(message => {
//   console.log('publish success ', message);
// });

// nearbyAPI.onPublishFailed(message => {
//   console.log('publish failed ', message);
// });

// nearbyAPI.onSubscribeFailed(() => {
//   console.log('subscribe failed ');
// });

// // To check if the nearby API is publishing.
// nearbyAPI.isPublishing((publishing, error) => {
//   console.log('is publishing ', publishing);
// });

// // To check if the nearby API is subscribing.
// nearbyAPI.isSubscribing((subscribing, error) => {
//   console.log(subscribing);
// });

// nearbyAPI.connect('AIzaSyCR0fINSu8-62WxVPeoYwg553fgLBCepek');

// // function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
// //   var R = 6371; // Radius of the earth in km
// //   var dLat = deg2rad(lat2 - lat1); // deg2rad below
// //   var dLon = deg2rad(lon2 - lon1);
// //   var a =
// //     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
// //     Math.cos(deg2rad(lat1)) *
// //       Math.cos(deg2rad(lat2)) *
// //       Math.sin(dLon / 2) *
// //       Math.sin(dLon / 2);
// //   var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
// //   var d = R * c; // Distance in km
// //   console.log('distance in kms ', d);
// //   return d;
// // }

// function deg2rad(deg) {
//   return deg * (Math.PI / 180);
// }

// const onMessage = (message: string) => {
//   if (myLocation) {
//     const otherDeviceLocationData = JSON.parse(message);
//     const {uuid, coords, timestamp} = otherDeviceLocationData;
//     if (uuid) {
//       const {latitude: myLatitude, longitude: myLongitude} = myLocation.coords;
//       const dist = greatCircleDistance(
//         coords.latitude,
//         coords.longitude,
//         myLatitude,
//         myLongitude,
//       );
//       //   geodist(
//       //     {lat: coords.latitude, lon: coords.longitude},
//       //     {lat: myLatitude, lon: myLongitude},
//       //     {unit: 'meters'},
//       //   );

//       // const distance = getDistanceFromLatLonInKm(
//       //   myLatitude,
//       //   myLongitude,
//       //   coords.latitude,
//       //   coords.longitude,
//       // );
//       if (dist <= DISTANCE_THRESHOLD) {
//         console.log('distance ', dist);
//         addNearbyUser({uuid, timestamp});
//       }
//     }

//     // }
//   }
// };

// function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
//   let a = 6378137,
//     b = 6356752.3142,
//     f = 1 / 298.257223563,
//     L = deg2rad(lon2 - lon1),
//     x = Math.atan(1 - f),
//     U1 = x * Math.tan(deg2rad(lat1)),
//     U2 = x * Math.tan(deg2rad(lat2)),
//     sinU1 = Math.sin(U1),
//     cosU1 = Math.cos(U1),
//     sinU2 = Math.sin(U2),
//     cosU2 = Math.cos(U2),
//     lambda = L,
//     lambdaP,
//     iterLimit = 100;
//   do {
//     var sinLambda = Math.sin(lambda),
//       cosLambda = Math.cos(lambda),
//       sinSigma = Math.sqrt(
//         cosU2 * sinLambda * (cosU2 * sinLambda) +
//           (cosU1 * sinU2 - sinU1 * cosU2 * cosLambda) *
//             (cosU1 * sinU2 - sinU1 * cosU2 * cosLambda),
//       );
//     if (0 === sinSigma) {
//       return 0; // co-incident points
//     }
//     var cosSigma = sinU1 * sinU2 + cosU1 * cosU2 * cosLambda,
//       sigma = Math.atan2(sinSigma, cosSigma),
//       sinAlpha = (cosU1 * cosU2 * sinLambda) / sinSigma,
//       cosSqAlpha = 1 - sinAlpha * sinAlpha,
//       cos2SigmaM = cosSigma - (2 * sinU1 * sinU2) / cosSqAlpha,
//       C = (f / 16) * cosSqAlpha * (4 + f * (4 - 3 * cosSqAlpha));
//     if (isNaN(cos2SigmaM)) {
//       cos2SigmaM = 0; // equatorial line: cosSqAlpha = 0 (§6)
//     }
//     lambdaP = lambda;
//     lambda =
//       L +
//       (1 - C) *
//         f *
//         sinAlpha *
//         (sigma +
//           C *
//             sinSigma *
//             (cos2SigmaM + C * cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM)));
//   } while (Math.abs(lambda - lambdaP) > 1e-12 && --iterLimit > 0);

//   if (0 === iterLimit) {
//     return NaN; // formula failed to converge
//   }

//   var uSq = (cosSqAlpha * (a * a - b * b)) / (b * b),
//     A = 1 + (uSq / 16384) * (4096 + uSq * (-768 + uSq * (320 - 175 * uSq))),
//     B = (uSq / 1024) * (256 + uSq * (-128 + uSq * (74 - 47 * uSq))),
//     deltaSigma =
//       B *
//       sinSigma *
//       (cos2SigmaM +
//         (B / 4) *
//           (cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM) -
//             (B / 6) *
//               cos2SigmaM *
//               (-3 + 4 * sinSigma * sinSigma) *
//               (-3 + 4 * cos2SigmaM * cos2SigmaM))),
//     s = b * A * (sigma - deltaSigma);
//   return s.toFixed(3); // round to 1mm precision
// }

// const PI = Math.PI;
// const RADIUS_OF_EARTH = 6371e3;

// const greatCircleDistance = (lat1, lng1, lat2, lng2) => {
//   const φ1 = getRadians(lat1);
//   const φ2 = getRadians(lat2);
//   const Δφ = getRadians(lat2 - lat1);
//   const Δλ = getRadians(lng2 - lng1);

//   /**
//    * Havershine's formula
//    *
//    */

//   const a =
//     Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
//     Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

//   const d = RADIUS_OF_EARTH * c;

//   // distance in kms.
//   return d / 1000;
// };

// const getRadians = coordinate => {
//   return (coordinate * PI) / 180;
// };
