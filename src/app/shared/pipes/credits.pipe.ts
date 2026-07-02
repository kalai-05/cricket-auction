import { Pipe, PipeTransform } from '@angular/core';
import { formatCredits } from '../utils/currency-format.util';

@Pipe({ name: 'appCredits' })
export class CreditsPipe implements PipeTransform {
  transform(amount: number | null | undefined): string {
    return formatCredits(amount ?? 0);
  }
}
