import { ChangeDetectionStrategy, Component, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ExpenseSearchForm } from "../../model/expense.model";

@Component({
    selector: 'app-expense-form',
    templateUrl: './expense-search-form.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class ExpenseSearchFormComponent {
    expenseForm: FormGroup<ExpenseSearchForm>;

    constructor(private fb: FormBuilder) {
        this.expenseForm = this.buildExpenseForm();
    }

    private buildExpenseForm(): FormGroup<ExpenseSearchForm> {
        return this.fb.group({
            name: this.fb.control({ value: '', disabled: false }, [Validators.required]),
            date: this.fb.control({ value: new Date(), disabled: false }, [Validators.required])
        });
    }
}
