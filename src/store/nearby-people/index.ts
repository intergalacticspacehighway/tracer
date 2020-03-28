import create from 'zustand';
import {INearbyUser} from 'types';
import {createOrUpdateUserRecord} from 'services';
const throttle = require('lodash.throttle');

const [useRecentDetectionsStore, api] = create(() => ({
  detections: [] as INearbyUser[],
}));

const addNearbyUser = throttle(
  (user: INearbyUser) => {
    createOrUpdateUserRecord(user);
    let detections = [...api.getState().detections];

    if (detections.length === 4) {
      detections.pop();
    }

    const index = detections.findIndex(person => person.uuid === user.uuid);
    if (index === -1) {
      detections.unshift(user);
      api.setState(() => ({detections}));
    } else {
      detections[index] = user;
      api.setState(() => ({detections}));
    }
  },
  2000,
  {trailing: false},
);

export {useRecentDetectionsStore, addNearbyUser};
