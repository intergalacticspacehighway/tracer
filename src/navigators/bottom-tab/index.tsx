import React from 'react';
import {Image} from 'react-native';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import {theme} from 'theme';
import {Nearby, CovidTest, useTranslatedText, HotSpots} from 'components';
import {History} from 'components';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';

const Tab = createMaterialBottomTabNavigator();

export function BottomTabNavigator() {
  const nearbyText = useTranslatedText('nearby');
  const history = useTranslatedText('history');
  const riskText = useTranslatedText('riskTest');

  return (
    <Tab.Navigator
      initialRouteName="Nearby"
      activeColor="white"
      labeled
      barStyle={{backgroundColor: theme.colors.primary}}
      sceneAnimationEnabled={false}>
      <Tab.Screen
        name="Nearby"
        component={Nearby}
        options={{
          tabBarLabel: nearbyText,
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons
              name="account-group"
              color={color}
              size={25}
            />
          ),
        }}
      />
      <Tab.Screen
        name="History"
        component={History}
        options={{
          tabBarLabel: history,
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons name="history" color={color} size={25} />
          ),
        }}
      />
      <Tab.Screen
        name="Hotspots"
        component={HotSpots}
        options={{
          tabBarLabel: 'Hotspots',
          tabBarIcon: ({color}) => (
            <Image
              source={require('../../../assets/images/bubble.png')}
              style={{width: 25, height: 25}}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Risk Test"
        component={CovidTest}
        options={{
          tabBarLabel: riskText,
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons name="check-all" color={color} size={25} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
