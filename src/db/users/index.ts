import {db} from '../index';
import {INearbyUser} from '../../types';

const TABLE_NAME = 'nearby_users';

export const createOrUpdateUserRecord = (user: INearbyUser) => {
  console.log('creating boi ', user);
  db.transaction(function(txn: any) {
    txn.executeSql(
      `CREATE TABLE IF NOT EXISTS ${TABLE_NAME}(
        uuid VARCHAR(50) PRIMARY KEY NOT NULL, distance FLOAT(8) NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`,
      [],
    );

    txn.executeSql(
      `INSERT INTO ${TABLE_NAME} (uuid, distance) VALUES (:uuid, :distance)`,
      [user.uuid, user.distance],
    );
  });
};

export const getNearbyPeopleList = () => {
  return new Promise((resolve, reject) => {
    db.readTransaction(
      function(t: any) {
        t.executeSql(`SELECT * FROM ${TABLE_NAME}`, [], function(t, r) {
          resolve(r.rows._array);
        });
      },
      function(e: any) {
        reject(e);
      },
    );
  });
};

const testDB = () => {
  db.transaction(function(txn: any) {
    txn.executeSql(`SELECT * FROM ${TABLE_NAME}`, [], function(
      tx: any,
      res: any,
    ) {
      for (let i = 0; i < res.rows.length; ++i) {
        console.log('item:', res.rows.item(i));
      }
    });
  });
};

const dropTable = () => {
  db.transaction(function(txn: any) {
    txn.executeSql('DROP TABLE nearby_users', []);
  });
};

setTimeout(() => {
  // dropTable();
}, 3000);
