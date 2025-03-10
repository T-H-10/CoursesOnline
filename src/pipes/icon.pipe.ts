import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'icon',
  standalone: true
})
export class IconPipe implements PipeTransform {

  transform(value: number): string {
    if (value == 1)
      return "people";
    else return "desktop_windows";
  }


}
