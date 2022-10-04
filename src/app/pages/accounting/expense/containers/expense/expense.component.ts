import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from "@angular/core";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { Observable } from "rxjs";
import { Expense, ExpenseSearch } from "../../model/expense.model";
import { ExpenseService } from "../../services/expense.service";

@Component({
    selector: 'app-expense',
    templateUrl: './expense.component.html',
    styles: [ 
        'app-expense { height: 100%; }',
        'app-expense { .result-container { flex-grow: 1; overflow: auto; margin-top: 0.5rem; padding-bottom: 0.75rem; } }'
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class ExpenseComponent implements OnInit {

    expenses$!: Observable<Expense[]>;

    faAdd = faAdd;

    constructor(private expenseService: ExpenseService) {}

    async ngOnInit(): Promise<void> {
        this.expenses$ = this.expenseService.subscribeExpense();
    }

    openAddExpenseModal(): void {
        this.expenseService.addExpense();
    }

    search(criteria: ExpenseSearch): void {
        this.expenseService.searchExpense(criteria);
    }

    async deleteExpense(expense: Expense): Promise<void> {
        await this.expenseService.deleteExpense(expense);
    }

    async editExpense(expense: Expense): Promise<void> {
        await this.expenseService.editExpense(expense);
    }

    clear(): void {
        this.expenseService.clearExpense();
    }

    viewAttachment(attachmentUrl: string): void {
        this.expenseService.viewAttachment(attachmentUrl);
    }

}
