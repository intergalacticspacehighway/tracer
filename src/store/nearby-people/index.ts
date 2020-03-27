import create from 'zustand';
import {INearbyUser} from 'types';
import {createOrUpdateUserRecord} from '../../db/users';

const [useNearbyPeopleStore, api] = create(() => ({
  people: {} as {
    [key: string]: INearbyUser;
  },
}));

const addNearbyUser = (user: INearbyUser) => {
  createOrUpdateUserRecord(user);
};

export {useNearbyPeopleStore, addNearbyUser};
