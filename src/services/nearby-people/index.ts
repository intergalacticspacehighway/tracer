import {database} from 'db';
import {INearbyUser} from '../../types';
import {Q} from '@nozbe/watermelondb';

const nearbyPeopleCollection = database.collections.get('nearbyPeople');

export const createOrUpdateUserRecord = async (user: INearbyUser) => {
  await database.action(async () => {
    const record = await nearbyPeopleCollection
      .query(Q.where('uuid', user.uuid))
      .fetch();

    if (record.length === 1) {
      const docRef = await nearbyPeopleCollection.find(record[0].id);

      await docRef.update((person: any) => {
        person.uuid = user.uuid;
        person.distance = user.distance;
      });
    } else {
      await nearbyPeopleCollection.create((person: any) => {
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

export const getNearbyPeopleList = async ({
  start,
  end,
}: {
  start: Date;
  end: Date;
}) => {
  const allUsers = await nearbyPeopleCollection
    .query(
      Q.where('updated_at', Q.gte(start.getTime())),
      Q.and(Q.where('updated_at', Q.lte(end.getTime()))),
    )
    .fetch();

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
