import { ChangeDetectionStrategy, Component, EventEmitter, Output, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { faMagnifyingGlass, faXmark } from "@fortawesome/free-solid-svg-icons";
import { Nullable, NullableBoolean, NullableBooleanFormControl, NullableString, NullableUserInfo, NullableUserInfoFormControl } from "src/app/common/types/common.type";
import { DROPDOWN_STATUS, RecurringExpenseSearchForm, RecurringExpenseSearchValue, Status } from "../../model/recurring-expense";

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

    readonly status = DROPDOWN_STATUS;

    constructor(private fb: FormBuilder) {
        this.searchForm = this.buildSearchForm();
    }

    search(): void {
        const searchValue = this.searchForm.getRawValue();
        this.onSearch.emit({
            name: searchValue.name!,
            paidBy: searchValue.paidBy?.uid!,
            active: searchValue.active?.value!
        });
    }

    reset(): void {
        this.searchForm.reset();
        this.onReset.emit();
    }

    get paidByCtrl(): NullableUserInfoFormControl {
        return this.searchForm.controls.paidBy;
    }

    get activeCtrl(): FormControl<Nullable<Status>> {
        return this.searchForm.controls.active;
    }

    statusDropdownFormatter = (result: Status) => result.title;

    private buildSearchForm(): FormGroup<RecurringExpenseSearchForm> {
        return this.fb.group({
            name: this.fb.control<NullableString>({ value: null, disabled: false }),
            paidBy: this.fb.control<NullableUserInfo>({ value: null, disabled: false}),
            active: this.fb.control<Nullable<Status>>({ value: null, disabled: false })
        });
    }

}
