import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewEncapsulation } from "@angular/core";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { RecurringExpense } from "../../model/recurring-expense";

@Component({
    selector: 'app-recurring-expense-result',
    templateUrl: './recurring-expense-result.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class RecurringExpenseResultComponent {

    @Input()
    recurringExpenses!: RecurringExpense[];

    @Output()
    onDelete = new EventEmitter<RecurringExpense>();

    faTrash = faTrash;

    deleteRecurringExpense(recurringExpense: RecurringExpense): void {
        this.onDelete.emit(recurringExpense);
    }

}
