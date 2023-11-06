import { Pipe, PipeTransform } from '@angular/core';
import { environments } from 'src/environments/environments';


@Pipe({
  name: 'userAvatar'
})
export class UserAvatarPipe implements PipeTransform {

  private readonly baseUrl: string = environments.baseUrl;

  transform(avatar: string): string {
    if (avatar.includes('https')) return avatar;
    return `${this.baseUrl}/usuarios/profile-image/${avatar}`

  }

}
