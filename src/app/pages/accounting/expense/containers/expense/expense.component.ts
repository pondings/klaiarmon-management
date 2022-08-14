import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from "@angular/core";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { Observable } from "rxjs";
import { Expense, ExpenseSearch } from "../../model/expense.model";
import { ExpenseService } from "../../services/expense.service";

@Component({
    selector: 'app-expense',
    templateUrl: './expense.component.html',
    styleUrls: ['./expense.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class ExpenseComponent implements OnInit {

    expenses$!: Observable<Expense[]>;

    faAdd = faAdd;

    constructor(private expenseService: ExpenseService) {}

    ngOnInit(): void {
        this.expenses$ = this.expenseService.getExpense();
    }

    openAddExpenseModal(): void {
        this.expenseService.openAddExpenseModal();
    }

    search(criteria: ExpenseSearch): void {
        this.expenseService.searchExpense(criteria);
    }

    clear(): void {
        console.log('Search form clear!');
    }

    viewAttachment(attachmentUrl: string): void {
        this.expenseService.viewAttachment(attachmentUrl);
    }

}
