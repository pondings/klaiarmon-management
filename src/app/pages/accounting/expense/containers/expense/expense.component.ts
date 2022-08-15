import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from "@angular/core";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { Observable } from "rxjs";
import { FireAuthService, UserInfo } from "src/app/core/services/fire-auth.service";
import { Expense, ExpenseSearch } from "../../model/expense.model";
import { ExpenseService } from "../../services/expense.service";

@Component({
    selector: 'app-expense',
    templateUrl: './expense.component.html',
    styles: [
        'app-expense { height: 100%; }',
        'app-expense .result-container { flex-grow: 1; overflow: auto; margin-top: 0.5rem; padding-bottom: 0.75rem; }'
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class ExpenseComponent implements OnInit {

    expenses$!: Observable<Expense[]>;

    faAdd = faAdd;

    currentUser!: UserInfo;

    constructor(private expenseService: ExpenseService,
        private fireAuthService: FireAuthService) {}

    async ngOnInit(): Promise<void> {
        this.expenses$ = this.expenseService.getExpense();
        this.currentUser = await this.fireAuthService.getCurrentUser();
    }

    openAddExpenseModal(): void {
        this.expenseService.addExpense();
    }

    search(criteria: ExpenseSearch): void {
        this.expenseService.searchExpense(criteria);
    }

    async deleteExpense(documentId: string): Promise<void> {
        await this.expenseService.deleteExpense(documentId);
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
