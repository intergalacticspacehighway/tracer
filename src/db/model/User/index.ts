import {Model} from '@nozbe/watermelondb';
import {field, readonly, date} from '@nozbe/watermelondb/decorators';

export class User extends Model {
  static table = 'user';
  @field('uuid') uuid;
  @readonly @date('created_at') createdAt;
  @readonly @date('updated_at') updatedAt;
}
