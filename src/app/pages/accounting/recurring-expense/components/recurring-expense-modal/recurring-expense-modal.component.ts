import { ChangeDetectionStrategy, Component, Input, OnInit, ViewEncapsulation } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { Observable } from "rxjs";
import { Action } from "src/app/common/enum/action";
import { NullableMeta, NullableNumber, NullableNumberFormControl, NullableString, NullableUserInfo, NullableUserInfoFormControl } from "src/app/common/types/common.type";
import { findArrDuplicated  } from "src/app/common/utils/common-util";
import { isFormDisabled, isFormValid } from "src/app/common/utils/form-util";
import { ToastService } from "src/app/core/toast/toast.service";
import { Billing, BillingForm } from "../../../expense/model/expense.model";
import { CYCLE_OPTIONS, DAY_OPTIONS } from "../../model/select-options";
import { RecurringExpenseForm } from "../../model/recurring-expense";
import { UntilDestroy } from "@ngneat/until-destroy";

@UntilDestroy({ checkProperties: true })
@Component({
    selector: 'app-recurring-expense-modal',
    templateUrl: './recurring-expense-modal.component.html',
    styleUrls: ['./recurring-expense-modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class RecurringExpenseModalComponent implements OnInit {

    @Input()
    action!: Action;

    isFormValid$!: Observable<boolean>;
    isFormDisabled$!: Observable<boolean>;

    dayOptions = DAY_OPTIONS;
    cycleOptions = CYCLE_OPTIONS;

    recurringExpenseForm: FormGroup<RecurringExpenseForm>;

    constructor(private activeModal: NgbActiveModal,
        private fb: FormBuilder,
        private toastService: ToastService) {
        this.recurringExpenseForm = this.buildRecurringExpenseForm();
    }

    ngOnInit(): void {
        this.isFormValid$ = this.recurringExpenseForm.statusChanges.pipe(isFormValid);
        this.isFormDisabled$ = this.recurringExpenseForm.statusChanges.pipe(isFormDisabled);
    }

    submit(): void {
        this.validateForm();
        const formValue = this.recurringExpenseForm.getRawValue();
        const billings = this.processBillingBeforeClose(formValue.billings);
        this.activeModal.close({
            ...formValue,
            paidBy: formValue.paidBy?.uid,
            billings
        });
    }

    dismiss(): void {
        this.activeModal.dismiss();
    }

    get paidByCtrl(): NullableUserInfoFormControl {
        return this.recurringExpenseForm.controls.paidBy;
    }

    get amountCtrl(): NullableNumberFormControl {
        return this.recurringExpenseForm.controls.amount;
    }

    get repeatCtrl(): NullableNumberFormControl {
        return this.recurringExpenseForm.controls.repeat;
    }

    get cycleCtrl(): NullableNumberFormControl {
        return this.recurringExpenseForm.controls.cycle;
    }

    get billingsFormArr(): FormArray<FormGroup<BillingForm>> {
        return this.recurringExpenseForm.controls.billings;
    }

    private validateForm(): void {
        const formValue = this.recurringExpenseForm.getRawValue();
        const billings = formValue.billings;

        const duplicateNames = billings.map(billing => billing.user)
            .map(user => user?.displayName)
            .filter(findArrDuplicated);
        if (duplicateNames[0]) {
            this.toastService.showWarning(`${duplicateNames.join(',')} has duplicated in billing section.`);
            throw 'Duplicate user in section';
        }
    }

    private processBillingBeforeClose(billings: { user: NullableUserInfo, amount: NullableNumber }[]): Billing[] {
        return billings.map(billing => ({ user: billing.user?.uid!, amount: billing.amount! }));
    }

    private buildRecurringExpenseForm(): FormGroup<RecurringExpenseForm> {
        return this.fb.group({
            name: this.fb.control<NullableString>({ value: null, disabled: false }, [Validators.required]),
            paidBy: this.fb.control<NullableUserInfo>({ value: null, disabled: false }, [Validators.required]),
            amount: this.fb.control<NullableNumber>({ value: null, disabled: false }),
            repeat: this.fb.control<NullableNumber>({ value: null, disabled: false }, [Validators.required]),
            cycle: this.fb.control<NullableNumber>({ value: null, disabled: false }),
            meta: this.fb.control<NullableMeta>({ value: {}, disabled: false }),
            billings: this.fb.array<FormGroup<BillingForm>>([]),
        });
    }

}
