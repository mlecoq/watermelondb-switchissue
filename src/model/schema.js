import {appSchema, tableSchema} from '@nozbe/watermelondb';

export default appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'tasks',
      columns: [{name: 'name', type: 'string'}],
    }),
    // We'll add tableSchemas here later
  ],
});
