import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewEncapsulation } from "@angular/core";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { UserInfo } from "src/app/core/services/fire-auth.service";
import { Expense } from "../../model/expense.model";

@Component({
    selector: 'app-expense-result',
    templateUrl: './expense-result.component.html',
    styleUrls: ['expense-result.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class ExpenseResultComponent {

    @Input()
    expense!: Expense;

    @Input()
    currentUser!: UserInfo;

    @Output()
    viewAttachment = new EventEmitter<string>();

    @Output()
    deleteExpense = new EventEmitter<string>();

    faPen = faPen;
    faTrash = faTrash;

    isCollapsed = true;

    editExpense(): void {}

    onDelete(): void {
        this.deleteExpense.emit(this.expense.meta.documentId);
    }

}
