import {appSchema, tableSchema} from '@nozbe/watermelondb';

export const schema = appSchema({
  version: 1030,
  tables: [
    tableSchema({
      name: 'nearbyPeople',
      columns: [
        {name: 'uuid', type: 'string', isIndexed: true},
        {name: 'distance', type: 'number'},
        {name: 'latitude', type: 'number', isOptional: true},
        {name: 'longitude', type: 'number', isOptional: true},
        {name: 'created_at', type: 'number'},
        {name: 'updated_at', type: 'number'},
      ],
    }),
    tableSchema({
      name: 'user',
      columns: [{name: 'uuid', type: 'string', isIndexed: true}],
    }),
  ],
});
