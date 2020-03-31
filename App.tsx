import React, {useEffect, useState} from 'react';
import {SafeAreaView, StatusBar, AsyncStorage} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {Provider as PaperProvider} from 'react-native-paper';
import {theme} from './src/theme';
import {Login, Header} from 'components';
import {BottomTabNavigator} from 'navigators';
import {firebaseAuth} from 'firebase';
import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {createUserRecord, useUserStore} from 'services';
import {useTranslation} from 'react-i18next';
import './src/localization';

const App = () => {
  const {i18n} = useTranslation();
  const [defaultLangLoaded, setDefaultLangLoaded] = useState(false);

  const {user} = useUserStore();

  function onAuthStateChanged(user: any) {
    if (user) {
      const _user: FirebaseAuthTypes.User = user._user;
      // console.log("user ", _user);
      try {
        createUserRecord(_user);
      } catch (e) {}
    } else {
      //@ts-ignore
    }
  }

  useEffect(() => {
    const subscriber = firebaseAuth.onAuthStateChanged(onAuthStateChanged);

    return subscriber;
  }, []);

  useEffect(() => {
    AsyncStorage.getItem('defaultLang')
      .then(res => {
        if (res) {
          i18n.changeLanguage(res);
        }
        setDefaultLangLoaded(true);
      })
      .catch((e: any) => {
        setDefaultLangLoaded(true);
      });
  }, [i18n, setDefaultLangLoaded]);

  if (!defaultLangLoaded) {
    return null;
  }

  return (
    <PaperProvider theme={theme}>
      <SafeAreaView>
        <StatusBar backgroundColor={theme.colors.primary} />
      </SafeAreaView>

      {user.uuid ? (
        <>
          {/* <Appbar.Header>
            <Appbar.Action onPress={toggleMenu} icon="menu"></Appbar.Action>
            <Appbar.Content title="eFight Covid-19"></Appbar.Content>
          </Appbar.Header> */}
          <Header />
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
