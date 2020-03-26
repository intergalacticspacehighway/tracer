import React from 'react';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import {colors} from 'theme';
import {Nearby} from 'components';
import {History} from 'components';

const Tab = createMaterialBottomTabNavigator();

export function BottomTabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Nearby"
      activeColor="white"
      barStyle={{backgroundColor: colors['cool-blue-80']}}
      sceneAnimationEnabled={false}>
      <Tab.Screen name="Nearby" component={Nearby} />
      <Tab.Screen name="History" component={History} />
    </Tab.Navigator>
  );
}
