import {Model} from '@nozbe/watermelondb';
import {field, readonly, date} from '@nozbe/watermelondb/decorators';

export class NearbyPeople extends Model {
  static table = 'nearbyPeople';
  @field('uuid') uuid;
  @field('distance') distance;
  @field('latitude') latitude;
  @field('longitude') longitude;
  @readonly @date('created_at') createdAt;
  @readonly @date('updated_at') updatedAt;
}
