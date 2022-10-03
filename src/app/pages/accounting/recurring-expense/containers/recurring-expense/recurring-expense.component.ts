import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from "@angular/core";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { Observable } from "rxjs";
import { RecurringExpense, RecurringExpenseSearchValue } from "../../model/recurring-expense";
import { RecurringExpenseService } from "../../services/recurring-expense.service";

@Component({
    selector: 'app-recurring-expense',
    templateUrl: './recurring-expense.component.html',
    styles: ['app-recurring-expense { height: 100% !important; }'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class RecurringExpenseComponet implements OnInit {

    recurringExpenses$!: Observable<RecurringExpense[]>;

    faAdd = faAdd;

    constructor(private recurringExpenseSerivce: RecurringExpenseService) {}

    ngOnInit(): void {
        this.recurringExpenses$ = this.recurringExpenseSerivce.subscribeRecurringExpense();
    }

    async addRecurringExpense(): Promise<void> {
        await this.recurringExpenseSerivce.addRecurringExpense();
    }

    async searchRecurringExpense(recurringExpenseSearchValue: RecurringExpenseSearchValue): Promise<void> {
        await this.recurringExpenseSerivce.searchRecurringExpense(recurringExpenseSearchValue);
    }

    async deleteRecurringExpense(recurringExpense: RecurringExpense): Promise<void> {
        await this.recurringExpenseSerivce.deleteRecurringExpense(recurringExpense);
    }

    resetRecurringExpense(): void {
        this.recurringExpenseSerivce.resetRecurringExpense();
    }

}
