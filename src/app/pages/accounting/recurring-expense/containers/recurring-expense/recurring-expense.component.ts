import { ChangeDetectionStrategy, Component, ViewEncapsulation } from "@angular/core";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { RecurringExpenseService } from "../../services/recurring-expense.service";

@Component({
    selector: 'app-recurring-expense',
    templateUrl: './recurring-expense.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class RecurringExpenseComponet {

    faAdd = faAdd;

    constructor(private recurringExpenseSerivce: RecurringExpenseService) {}

    async addRecurringExpense(): Promise<void> {
        await this.recurringExpenseSerivce.addRecurringExpense();
    }

}
