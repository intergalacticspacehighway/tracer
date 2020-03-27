import create from 'zustand';
import {INearbyUser} from 'types';
import {createOrUpdateUserRecord} from 'services';
const throttle = require('lodash.throttle');

const [useNearbyPeopleStore, api] = create(() => ({person: {} as INearbyUser}));

const addNearbyUser = throttle(
  (user: INearbyUser) => {
    api.setState(() => ({
      person: user,
    }));
    createOrUpdateUserRecord(user);
  },
  2000,
  {trailing: false},
);

export {useNearbyPeopleStore, addNearbyUser};
