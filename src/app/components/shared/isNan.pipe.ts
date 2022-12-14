import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe to return true if the number is NaN
 */
@Pipe({
  name: 'isNaN'
})
export class IsNaNPipe implements PipeTransform {
  transform(item: number): boolean {
    return isNaN(item);
  }
}
