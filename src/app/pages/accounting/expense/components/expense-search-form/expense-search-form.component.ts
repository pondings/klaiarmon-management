import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { faCalendar, faMagnifyingGlass, faXmark } from "@fortawesome/free-solid-svg-icons";
import { Observable, startWith } from "rxjs";
import { Nullable } from "src/app/common/types/common.type";
import { getDateStruct, NullableDateStruct } from "src/app/common/utils/date-struct.util";
import { getDateFromDateStruct } from "src/app/common/utils/date.util";
import { UserInfo } from "src/app/core/services/fire-auth.service";
import { ExpenseSearch, ExpenseSearchForm } from "../../model/expense.model";

@Component({
    selector: 'app-expense-search-form',
    templateUrl: './expense-search-form.component.html',
    styleUrls: ['./expense-search-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class ExpenseSearchFormComponent implements OnInit {

    @Output()
    search = new EventEmitter<ExpenseSearch>();

    @Output()
    clear = new EventEmitter<void>();

    startDateValue$!: Observable<NullableDateStruct>;
    endDateValue$!: Observable<NullableDateStruct>;

    expenseForm: FormGroup<ExpenseSearchForm>;

    faXmark = faXmark;
    faCalendar = faCalendar;
    faMagnifyingGlass = faMagnifyingGlass;

    constructor(private fb: FormBuilder) {
        this.expenseForm = this.buildExpenseForm();
    }

    ngOnInit(): void {
        this.startDateValue$ = this.startDateCtrl.valueChanges.pipe(startWith(this.startDateCtrl.value));
        this.endDateValue$ = this.endDateCtrl.valueChanges.pipe(startWith(this.endDateCtrl.value));
    }

    onSearch(): void {
        const formValue = this.expenseForm.getRawValue();
        this.search.emit({
            name: formValue.name!,
            paidBy: formValue.paidBy?.uid!,
            startDate: getDateFromDateStruct(formValue.startDate!)!,
            endDate: getDateFromDateStruct(formValue.endDate!)!
        });
    }

    clearSelectedUser(): void {
        this.paidByCtrl.reset();
        this.paidByCtrl.enable();
    }

    clearForm(): void {
        this.expenseForm.reset({ startDate: getDateStruct(), endDate: getDateStruct() });
        this.paidByCtrl.enable();
        this.clear.emit();
    }

    get startDateCtrl(): FormControl<NullableDateStruct> {
        return this.expenseForm.controls.startDate;
    }

    get endDateCtrl(): FormControl<NullableDateStruct> {
        return this.expenseForm.controls.endDate;
    }

    get paidByCtrl(): FormControl<Nullable<Partial<UserInfo>>> {
        return this.expenseForm.controls.paidBy;
    }

    private buildExpenseForm(): FormGroup<ExpenseSearchForm> {
        return this.fb.group({
            name: this.fb.control({ value: '', disabled: false }),
            paidBy: this.fb.control({ value: {}, disabled: false }),
            startDate: this.fb.control({ value: getDateStruct(), disabled: false }),
            endDate: this.fb.control({ value: getDateStruct(), disabled: false })
        });
    }

}
