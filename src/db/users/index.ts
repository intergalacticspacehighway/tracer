import {db} from '../index';
import {INearbyUser} from '../../types';

const TABLE_NAME = 'nearby_users';

export const createOrUpdateUserRecord = (user: INearbyUser) => {
  db.transaction(function(txn: any) {
    // txn.executeSql("DROP TABLE IF EXISTS nearby_users", []);

    txn.executeSql(
      `CREATE TABLE IF NOT EXISTS ${TABLE_NAME}(
        uuid VARCHAR(50) PRIMARY KEY NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`,
      [],
    );
    txn.executeSql(`SELECT uuid FROM ${TABLE_NAME}`, [], function(
      tx: any,
      res: any,
    ) {
      if (res.rows.length === 0) {
        tx.executeSql(`INSERT INTO ${TABLE_NAME} (uuid) VALUES (:uuid)`, [
          user.uuid,
        ]);
      }
    });
  });
};

export const testDB = () => {
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
