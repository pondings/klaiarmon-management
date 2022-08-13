import { ChangeDetectionStrategy, Component, ViewEncapsulation } from "@angular/core";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { ExpenseSearch } from "../../model/expense.model";
import { ExpenseService } from "../../services/expense.service";

@Component({
    selector: 'app-expense',
    templateUrl: './expense.component.html',
    styleUrls: ['./expense.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class ExpenseComponent {

    faAdd = faAdd;

    constructor(private expenseService: ExpenseService) {}

    openAddExpenseModal(): void {
        this.expenseService.openAddExpenseModal();
    }

    search(expenseSearch: ExpenseSearch): void {
        console.log(expenseSearch);
    }

    clear(): void {
        console.log('Search form clear!');
    }

}
