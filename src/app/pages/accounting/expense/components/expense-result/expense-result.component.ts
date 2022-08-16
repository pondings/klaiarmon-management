import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewEncapsulation } from "@angular/core";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
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

    @Output()
    viewAttachment = new EventEmitter<string>();

    @Output()
    deleteExpense = new EventEmitter<string>();

    @Output()
    editExpense = new EventEmitter<Expense>();

    faPen = faPen;
    faTrash = faTrash;

    isCollapsed = true;

    onEdit(): void {
        this.editExpense.emit(this.expense);
    }

    onDelete(): void {
        this.deleteExpense.emit(this.expense.meta.documentId);
    }

}
