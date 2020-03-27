import {database} from '../index';
import {INearbyUser} from '../../types';
import {Q} from '@nozbe/watermelondb';

const nearbyPeopleCollection = database.collections.get('nearbyPeople');

export const createOrUpdateUserRecord = async (user: INearbyUser) => {
  await database.action(async () => {
    const record = await nearbyPeopleCollection
      .query(Q.where('uuid', user.uuid))
      .fetch();

    if (record.length === 1) {
      // Ignore
      // await record.update(person => {
      //   person.uuid = user.uuid;
      //   person.distance = user.distance;
      // });
    } else {
      await nearbyPeopleCollection.create(person => {
        person.uuid = user.uuid;
        person.distance = user.distance;
      });
    }
  });
  // db.transaction(function(txn: any) {
  //   txn.executeSql(
  //     `CREATE TABLE IF NOT EXISTS ${TABLE_NAME}(
  //       uuid VARCHAR(50) PRIMARY KEY NOT NULL, distance FLOAT(8) NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`,
  //     [],
  //   );

  //   txn.executeSql(
  //     `INSERT INTO ${TABLE_NAME} (uuid, distance) VALUES (:uuid, :distance)`,
  //     [user.uuid, user.distance],
  //   );
  // });
};

export const getNearbyPeopleList = async () => {
  const allUsers = await nearbyPeopleCollection.query().fetch();
  return allUsers;
};

const dropTable = () => {
  db.transaction(function(txn: any) {
    txn.executeSql('DROP TABLE nearby_users', []);
  });
};

// setTimeout(() => {
//   // createOrUpdateUserRecord();
// }, 2000);

// setTimeout(() => {
//   getNearbyPeopleList();
// }, 2000);
