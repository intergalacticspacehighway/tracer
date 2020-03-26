import React, {useReducer, useEffect} from 'react';
import {getNearbyPeopleList} from 'db';

const actions = {
  loading: 'loading',
  error: 'error',
  success: 'success',
};

const initialState = {
  status: 'idle',
  data: [],
  error: null,
};

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case actions.loading:
      return {...state, status: 'loading'};
    case actions.success:
      return {...state, status: 'success', data: action.payload};
    case actions.error:
      return {...state, status: 'error', error: action.payload};
    default:
      return state;
  }
};

export function History() {
  const [state, dispatch] = useReducer(reducer, initialState);
  useEffect(() => {
    async function getData() {
      const nearbyPeople = await getNearbyPeopleList();
      console.log('nearby people ', nearbyPeople);
    }
    getData();
  }, []);
  return null;
}
