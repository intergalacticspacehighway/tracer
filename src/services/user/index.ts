import {IUser} from '../../types';
import {AsyncStorage} from 'react-native';
import {create} from 'zustand';
import {firebaseAuth} from 'firebase';
const [useUserStore, api] = create(set => ({
  user: {} as IUser,
}));

export const createUserRecord = async (user: IUser) => {
  api.setState(() => ({user}));
  await AsyncStorage.setItem('uuid', user.uuid);
};

export const logout = async () => {
  api.setState(() => ({user: {}}));

  firebaseAuth.signOut();
};

export const getUserUUID = async () => {
  const uuid = await AsyncStorage.getItem('uuid');
  return uuid;
};

export {useUserStore};
