import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { faCalendar, faMagnifyingGlass, faXmark } from "@fortawesome/free-solid-svg-icons";
import { map, Observable, OperatorFunction, startWith, switchMap, tap } from "rxjs";
import { Nullable } from "src/app/common/types/common.type";
import { getDateStruct, NullableDateStruct } from "src/app/common/utils/date-struct.util";
import { getMoment } from "src/app/common/utils/moment.util";
import { FireAuthService, UserInfo } from "src/app/core/services/fire-auth.service";
import { ExpenseSearch, ExpenseSearchForm } from "../../model/expense.model";

@Component({
    selector: 'app-expense-search-form',
    templateUrl: './expense-search-form.component.html',
    styleUrls: ['./expense-search-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class ExpenseSearchFormComponent implements OnInit {

    search = new EventEmitter<ExpenseSearch>();
    clear = new EventEmitter<void>();

    users$!: Observable<UserInfo[]>;
    startDateValue$!: Observable<NullableDateStruct>;
    endDateValue$!: Observable<NullableDateStruct>;

    expenseForm: FormGroup<ExpenseSearchForm>;

    faXmark = faXmark;
    faCalendar = faCalendar;
    faMagnifyingGlass = faMagnifyingGlass;

    constructor(private fb: FormBuilder,
        private fireAuthService: FireAuthService) {
        this.expenseForm = this.buildExpenseForm();
    }

    ngOnInit(): void {
        this.users$ = this.fireAuthService.getAllUsers();
        this.startDateValue$ = this.startDateCtrl.valueChanges.pipe(startWith(this.startDateCtrl.value));
        this.endDateValue$ = this.endDateCtrl.valueChanges.pipe(startWith(this.endDateCtrl.value));
    }

    onSearch(): void {
        const formValue = this.expenseForm.getRawValue();
        this.search.emit({
            name: formValue.name!,
            paidBy: formValue.paidBy?.uid!,
            startDate: getMoment(formValue.startDate)?.toDate()!,
            endDate: getMoment(formValue.endDate)?.toDate()!
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

    searchUsers: OperatorFunction<string, readonly UserInfo[]> = (text$: Observable<string>) =>
        text$.pipe(switchMap(text => this.users$.pipe(this.mapMatchingUsers(text))));

    searchUserFormatter(result: UserInfo): string {
        return result.displayName!;
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

    private mapMatchingUsers(candidate: string): OperatorFunction<UserInfo[], UserInfo[]> {
        return users$ => users$.pipe(map(users => users.filter(this.matchUserDisplayNameIgnoreCase(candidate))));
    }

    private matchUserDisplayNameIgnoreCase(candidate: string): (user: UserInfo) => boolean {
        return user => user.displayName?.toLowerCase().includes(candidate.toLowerCase())!;
    }

}
