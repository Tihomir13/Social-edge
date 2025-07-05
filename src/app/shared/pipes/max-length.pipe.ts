import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'maxLengthPipe',
  standalone: true,
})
export class MaxLengthPipe implements PipeTransform {
  transform(value: string, maxLength: number, addEllipsis: boolean = false): string {
    if (!value) return value;
    if (value.length <= maxLength) return value;
    return value.slice(0, maxLength) + (addEllipsis ? '...' : '');
  }
}
