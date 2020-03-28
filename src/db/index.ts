import {NearbyPeople, User} from './model';
import {Database} from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import {schema} from './model/schema';

const adapter = new SQLiteAdapter({
  schema,
});

const database = new Database({
  adapter,
  modelClasses: [NearbyPeople, User],
  actionsEnabled: true,
});

export {database};
