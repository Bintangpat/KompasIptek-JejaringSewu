import { Platform } from 'react-native';

export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  (Platform.OS === 'android'
    ? 'http://10.0.2.2:4000/api/v1'
    : 'http://localhost:4000/api/v1');

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'jejaring_sewu_access_token',
  REFRESH_TOKEN: 'jejaring_sewu_refresh_token',
  USER_DATA: 'jejaring_sewu_user_data',
  DEVICE_ID: 'jejaring_sewu_device_id',
  OFFLINE_MUTATION_QUEUE: 'jejaring_sewu_offline_queue',
};

export const PRINGSEWU_COORDINATES = {
  latitude: -5.3585,
  longitude: 104.9754,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};
