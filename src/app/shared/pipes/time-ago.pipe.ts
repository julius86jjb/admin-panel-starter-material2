import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';


@Pipe({
  name: 'timeAgo'
})
export class TimeAgoPipe implements PipeTransform {

  transform(value: string | undefined, ...args: unknown[]): unknown {
    if (!value) return 'Never'
    return moment(value).fromNow();
  }

}
