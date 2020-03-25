//@ts-ignore
import {NearbyAPI} from 'react-native-nearby-api';
import {PermissionsAndroid} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import {addNearbyUser} from '../store/nearby-people';
import {uniqueId} from '../utils';
const nearbyAPI = new NearbyAPI(true);

// Distance threshold in meter
const DISTANCE_THRESHOLD = 1;
let myLocation: any = null;

async function getLocation() {
  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    {
      title: 'Location Permission',
      message:
        'This App needs access to your location ' +
        'so we can know where you are.',
    },
  );

  if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    console.log('You can use locations ');
    function getLocation() {
      return new Promise((resolve, reject) => {
        Geolocation.getCurrentPosition(resolve, reject);
      });
    }

    const data = await getLocation();

    return data;
  } else {
    console.log('Location permission denied');
  }
}

nearbyAPI.onSubscribeSuccess(async () => {
  console.log('subscribe success');
  myLocation = await getLocation();
  nearbyAPI.publish(JSON.stringify({...myLocation, uuid: uniqueId}));
  setInterval(async () => {
    myLocation = await getLocation();
    nearbyAPI.publish(JSON.stringify(myLocation));
  }, 10000);
});

nearbyAPI.onFound(message => {
  console.log('Message Found!', typeof message);
  onMessage(message);
});

nearbyAPI.onLost(message => {
  console.log('Message Lost!');
  onMessage(message);
});

////

/// Not needed

nearbyAPI.onConnected(async message => {
  nearbyAPI.subscribe();
  myLocation = await getLocation();
  console.log('connected ', message);
});

nearbyAPI.onDisconnected(message => {
  console.log(message);
});

nearbyAPI.onDistanceChanged((message, value) => {
  console.log('Distance Changed!');
  console.log(message, value);
});

nearbyAPI.onPublishSuccess(message => {
  console.log('publish success ', message);
});

nearbyAPI.onPublishFailed(message => {
  console.log('publish failed ', message);
});

nearbyAPI.onSubscribeFailed(() => {
  console.log('subscribe failed ');
});

// To check if the nearby API is publishing.
nearbyAPI.isPublishing((publishing, error) => {
  console.log('is publishing ', publishing);
});

// To check if the nearby API is subscribing.
nearbyAPI.isSubscribing((subscribing, error) => {
  console.log(subscribing);
});

nearbyAPI.connect('AIzaSyCR0fINSu8-62WxVPeoYwg553fgLBCepek');

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1); // deg2rad below
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  console.log('distance in kms ', d);
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

const onMessage = (message: string) => {
  const otherDeviceLocationData = JSON.parse(message);
  const {uuid, coords, timestamp} = otherDeviceLocationData;
  if (uuid) {
    const {latitude: myLatitude, longitude: myLongitude} = myLocation.coords;
    const distance = getDistanceFromLatLonInKm(
      myLatitude,
      myLongitude,
      coords.latitude,
      coords.longitude,
    );
    if (distance < 0.014) {
      addNearbyUser({uuid, timestamp});
    }
  }
};
