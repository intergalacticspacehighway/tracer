import React, {useEffect} from 'react';
import {SafeAreaView, StatusBar, StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {Provider as PaperProvider, Appbar} from 'react-native-paper';
import {theme} from './src/theme';
import {colors} from './src/theme/colors';
import {Login} from 'components';
import {BottomTabNavigator} from 'navigators';
import {firebaseAuth} from 'firebase';
import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {createUserRecord, getUserUUID, useUserStore} from 'services';
import {CustomDrawerContent} from './src/navigators/drawer';

const App = () => {
  const user = useUserStore(state => state.user);

  function onAuthStateChanged(user: any) {
    if (user) {
      const _user: FirebaseAuthTypes.User = user._user;
      // console.log("user ", _user);
      try {
        createUserRecord({uuid: 'hey bro'});
      } catch (e) {}
    } else {
      //@ts-ignore
    }
  }

  useEffect(() => {
    const subscriber = firebaseAuth.onAuthStateChanged(onAuthStateChanged);

    return subscriber;
  }, []);

  return (
    <PaperProvider theme={theme}>
      <Appbar.Header>
        <Appbar.Action onPress={() => {}} icon="arrow-left" />
      </Appbar.Header>
      <SafeAreaView>
        <StatusBar backgroundColor={colors['cool-blue-100']} />
      </SafeAreaView>
      {user.uuid ? (
        <>
          <CustomDrawerContent />

          <NavigationContainer>
            <BottomTabNavigator />
          </NavigationContainer>
        </>
      ) : (
        <Login />
      )}
    </PaperProvider>
  );
};

export default App;

const styles = StyleSheet.create({
  bottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
});
