import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe to return true if the number is NOT NaN
 */
@Pipe({
  name: 'isNotNaN'
})
export class IsNotNaNPipe implements PipeTransform {
  transform(item: number): boolean {
    return !isNaN(item);
  }
}
