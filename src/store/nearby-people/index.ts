import create from 'zustand';

interface INearbyPeople {
  uuid: string;
  timestamp: any;
}

const [useNearbyPeopleStore, api] = create(() => ({
  people: {} as {
    [key: string]: INearbyPeople;
  },
}));

const addNearbyUser = (user: INearbyPeople) => {
  const state = api.getState();
  api.setState({
    ...state,
    people: {
      [user.uuid]: {
        ...state.people[user.uuid],
        uuid: user.uuid,
        timestamp: user.timestamp,
      },
    },
  });
};

export {useNearbyPeopleStore, addNearbyUser};
