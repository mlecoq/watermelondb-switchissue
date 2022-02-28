import {Model} from '@nozbe/watermelondb';
import {text} from '@nozbe/watermelondb/decorators';

export default class Task extends Model {
  static table = 'tasks';

  @text('name') name;
}
