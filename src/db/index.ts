//@ts-ignore
import SQLite from 'react-native-sqlite-2';

const db = SQLite.openDatabase('app.db', '1.0', '', 1);

export {db};
export * from './users';
