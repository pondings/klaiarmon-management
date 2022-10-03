import { ChangeDetectionStrategy, Component, EventEmitter, Output, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { faMagnifyingGlass, faXmark } from "@fortawesome/free-solid-svg-icons";
import { NullableString, NullableUserInfo, NullableUserInfoFormControl } from "src/app/common/types/common.type";
import { RecurringExpenseSearchForm, RecurringExpenseSearchValue } from "../../model/recurring-expense";

@Component({
    selector: 'app-recurring-expense-search-form',
    templateUrl: 'recurring-expense-search-form.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class RecurringExpenseSearchFormComponent {

    @Output()
    onSearch = new EventEmitter<RecurringExpenseSearchValue>();

    @Output()
    onReset = new EventEmitter<void>();

    searchForm: FormGroup<RecurringExpenseSearchForm>;

    faXmark = faXmark;
    faMagnifyingGlass = faMagnifyingGlass;

    constructor(private fb: FormBuilder) {
        this.searchForm = this.buildSearchForm();
    }

    search(): void {
        const searchValue = this.searchForm.getRawValue();
        this.onSearch.emit({
            name: searchValue.name!,
            paidBy: searchValue.paidBy?.uid!
        });
    }

    reset(): void {
        this.onReset.emit();
    }

    get paidByCtrl(): NullableUserInfoFormControl {
        return this.searchForm.controls.paidBy;
    }

    private buildSearchForm(): FormGroup<RecurringExpenseSearchForm> {
        return this.fb.group({
            name: this.fb.control<NullableString>({ value: null, disabled: false }),
            paidBy: this.fb.control<NullableUserInfo>({ value: null, disabled: false})
        });
    }

}
