import { Pipe, PipeTransform } from "@angular/core";
import { Billing } from "../../expense/model/expense.model";

@Pipe({ name: 'averagePerMonth' })
export class AveragePerMonthPipe implements PipeTransform {

    transform(target: Billing, period: number): string {
        if ([0, '0', null, undefined].includes(target.amount)) return 'N/A';
        return `${(target.amount / period).toFixed(2)} per month`;
    }

}
