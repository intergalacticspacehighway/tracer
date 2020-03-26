import create from 'zustand';
import {INearbyUser} from 'types';
import {createOrUpdateUserRecord} from 'db';

const [useNearbyPeopleStore, api] = create(() => ({
  people: {} as {
    [key: string]: INearbyUser;
  },
}));

const addNearbyUser = (user: INearbyUser) => {
  // const state = api.getState();
  // api.setState({
  //   ...state,
  //   people: {
  //     [user.uuid]: {
  //       ...state.people[user.uuid],
  //       uuid: user.uuid,
  //       timestamp: user.timestamp,
  //     },
  //   },
  // });
  createOrUpdateUserRecord(user);
};

export {useNearbyPeopleStore, addNearbyUser};
