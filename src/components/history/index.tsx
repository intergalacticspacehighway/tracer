import React, {useReducer, useEffect} from 'react';
import {ActivityIndicator, Text} from 'react-native-paper';
import {View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {INearbyUser} from 'types';
import {useIsFocused} from '@react-navigation/native';
import {getNearbyPeopleList} from '../../db/users';
import {formatTimestamp} from 'utils';

const types = {
  loading: 'loading',
  error: 'error',
  success: 'success',
};

const initialState = {
  status: 'idle',
  data: [] as INearbyUser[],
  error: null,
};

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case types.loading:
      return {...state, status: 'loading'};
    case types.success:
      return {...state, status: 'success', data: action.payload};
    case types.error:
      return {...state, status: 'error', error: action.payload};
    default:
      return state;
  }
};

export function History() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const isFocused = useIsFocused();

  useEffect(() => {
    async function getData() {
      try {
        dispatch({type: types.loading});
        const nearbyPeople = await getNearbyPeopleList();
        dispatch({type: types.success, payload: nearbyPeople});
      } catch (e) {
        dispatch({
          type: types.error,
          payload: 'No data found',
        });
      }
    }
    getData();
  }, [isFocused]);

  //   if (state.status === 'loading') {
  //     return <ActivityIndicator />;
  //   }
  if (state.status === 'error') {
    return <Text>{state.error}</Text>;
  }

  if (state.data === 'success' && state.data.length === 0) {
    return <Text>No nearby people yet</Text>;
  }

  if (state.status === 'success') {
    return (
      <View>
        <ScrollView>
          {state.data.map((user: INearbyUser) => {
            return (
              <View key={user.uuid}>
                <Text>signal uuid: {user.uuid}</Text>
                <Text>Distance: {user.distance} m</Text>
                <Text>
                  Created at :{'     '}
                  {formatTimestamp(user.updatedAt)}
                </Text>
              </View>
            );
          })}
        </ScrollView>
      </View>
    );
  }
  console.log('data  ', state);
  return null;
}
