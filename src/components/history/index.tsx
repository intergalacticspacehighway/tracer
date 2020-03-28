import React, {useReducer, useEffect, useState} from 'react';
import {Text, Button} from 'react-native-paper';
import {View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {INearbyUser} from 'types';
import {getNearbyPeopleList} from 'services';
import {formatDate} from 'utils';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {colors} from 'theme';
import {UserCard} from '../user-card';
import {subDays, startOfDay} from 'date-fns';
import {endOfDay} from 'date-fns/esm';

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

const StartAndEndDate = ({start, end, setStart, setEnd}: any) => {
  const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);
  const [isStartDatePickerVisible, setStartDatePickerVisibility] = useState(
    false,
  );

  const showStartDatePicker = () => {
    setStartDatePickerVisibility(true);
  };

  const showEndDatePicker = () => {
    setEndDatePickerVisibility(true);
  };

  const handleStartDateConfirm = (pickedDate: any) => {
    setStartDatePickerVisibility(false);
    setStart(pickedDate);
  };

  const handleEndDateConfirm = (pickedDate: any) => {
    setEndDatePickerVisibility(false);
    setEnd(pickedDate);
  };

  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          margin: 10,
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Button
          style={{
            borderWidth: 1,
            borderColor: colors['cool-blue-80'],
          }}
          onPress={showStartDatePicker}>
          {formatDate(start)}
        </Button>
        <View
          style={{
            height: 2,
            backgroundColor: colors['cool-blue-100'],
            width: 10,
          }}></View>
        <Button
          style={{
            borderWidth: 1,
            borderColor: colors['cool-blue-80'],
          }}
          onPress={showEndDatePicker}>
          {formatDate(end)}
        </Button>
      </View>

      <DateTimePickerModal
        style={{backgroundColor: 'black'}}
        isVisible={isStartDatePickerVisible}
        mode="date"
        date={start}
        onConfirm={handleStartDateConfirm}
        onCancel={() => setStartDatePickerVisibility(false)}
      />
      <DateTimePickerModal
        style={{backgroundColor: 'black'}}
        isVisible={isEndDatePickerVisible}
        mode="date"
        date={end}
        onConfirm={handleEndDateConfirm}
        onCancel={() => setEndDatePickerVisibility(false)}
      />
    </View>
  );
};

const today = new Date();

export function History() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [start, setStart] = useState(startOfDay(subDays(today, 1)));
  const [end, setEnd] = useState(endOfDay(today));

  useEffect(() => {
    async function getData() {
      try {
        dispatch({type: types.loading});
        const nearbyPeople = await getNearbyPeopleList({start, end});
        dispatch({type: types.success, payload: nearbyPeople});
      } catch (e) {
        dispatch({
          type: types.error,
          payload: 'No data found',
        });
      }
    }
    getData();
  }, [start, end]);

  //   if (state.status === 'loading') {
  //     return <ActivityIndicator />;
  //   }
  if (state.status === 'error') {
    return <Text>{state.error}</Text>;
  }

  if (state.data === 'success' && state.data.length === 0) {
    return <Text>No nearby people yet</Text>;
  }

  return (
    <View>
      <StartAndEndDate
        setEnd={setEnd}
        end={end}
        start={start}
        setStart={setStart}
      />
      {state.status === 'success' && (
        <ScrollView>
          {state.data.map((user: INearbyUser) => {
            return <UserCard key={user.uuid} item={user} />;
          })}
        </ScrollView>
      )}
    </View>
  );
}
