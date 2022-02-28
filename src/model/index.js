import {setGenerator} from '@nozbe/watermelondb/utils/common/randomId';
import {v4 as uuid} from 'uuid';
import schema from './schema';
import migrations from './migrations';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import {Database} from '@nozbe/watermelondb';
import Task from './classes/Task';

setGenerator(uuid);

export default dbName => {
  console.log(`Database : ${dbName}`);

  const adapter = new SQLiteAdapter({
    schema,
    dbName,
    jsi: true,
    migrations,
  });

  return new Database({
    adapter,
    modelClasses: [Task],
  });
};
