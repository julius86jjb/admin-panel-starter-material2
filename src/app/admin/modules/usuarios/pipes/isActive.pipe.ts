import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'isActive'
})

export class IsActivePipe implements PipeTransform {


  transform(value: boolean ): 'success' | 'danger' {

    return value ? 'success' : 'danger'

  }
}
