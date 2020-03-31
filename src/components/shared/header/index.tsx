import {View, StyleSheet, Image} from 'react-native';
import React, {useState} from 'react';
import {Text} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import {Button, Paragraph, Menu, Divider, Provider} from 'react-native-paper';
import {theme} from 'theme';
import {useTranslation} from 'react-i18next';
import {changeLanguage} from 'utils';
import {logout} from 'services';

const Header = () => {
  return (
    <View style={styles.wrapper}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Image
          source={require('../../../../assets/images/app_icon.png')}
          style={{width: 18, height: 20}}></Image>
        <Text
          style={{
            fontSize: 18,
            fontFamily: 'Montserrat-Bold',
            color: theme.colors.primary,
            paddingLeft: 10,
          }}>
          eFight
        </Text>
      </View>
      <View>
        <HeaderMenu />
        {/* <Text>eFight</Text> */}
      </View>
    </View>
  );
};

const HeaderMenu = () => {
  const [visible, setVisible] = useState(false);

  const _openMenu = () => setVisible(true);

  const _closeMenu = () => setVisible(false);

  const {i18n} = useTranslation();
  const currentLang = i18n.language;

  return (
    <View>
      <Menu
        visible={visible}
        onDismiss={_closeMenu}
        anchor={
          <Button onPress={_openMenu}>
            <MaterialCommunityIcons
              name="dots-horizontal"
              color={theme.colors.primary}
              size={25}
            />
          </Button>
        }>
        <Menu.Item
          onPress={() => {
            changeLanguage(i18n, 'hi');
            _closeMenu();
          }}
          disabled={currentLang === 'hi'}
          title="Hindi"
        />
        <Menu.Item
          onPress={() => {
            changeLanguage(i18n, 'en');
            _closeMenu();
          }}
          disabled={currentLang === 'en'}
          title="English"
        />
        <Menu.Item
          disabled={currentLang === 'gu'}
          onPress={() => {
            changeLanguage(i18n, 'gu');
            _closeMenu();
          }}
          title="Gujarati"
        />
        <Divider />
        <Menu.Item
          onPress={logout}
          title="Logout"
          icon="account-arrow-right-outline"
        />
      </Menu>
    </View>
  );
};

export {Header};

const styles = StyleSheet.create({
  wrapper: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    padding: 18,
    paddingTop: 10,
    paddingBottom: 0,
    backgroundColor: 'white',
  },
});
