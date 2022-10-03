import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, ViewEncapsulation } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { faCircleMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { Observable } from "rxjs";
import { Action } from "src/app/common/enum/action";
import { NullableNumber, NullableNumberFormControl, NullableUserInfo, NullableUserInfoFormControl } from "src/app/common/types/common.type";
import { BillingForm } from "../../../expense/model/expense.model";
import { RecurringExpenseForm } from "../../model/recurring-expense";

@Component({
    selector: 'app-recurring-expense-billing',
    templateUrl: './recurring-expense-billing.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class RecurringExpenseBillingComponent {
    
    @Input()
    billingFormArr!: FormArray<FormGroup<BillingForm>>;

    @Input()
    action!: Action;

    @Input()
    isDisabled!: boolean;

    @Input()
    isRequireAmount = true;

    faPlus = faPlus;
    faCircleMinus = faCircleMinus;

    overRemain$!: Observable<string>;

    private parentForm!: FormGroup<RecurringExpenseForm>;

    constructor(private fb: FormBuilder,
        private cdr: ChangeDetectorRef) { }

    ngOnInit(): void {
        this.parentForm = <FormGroup<RecurringExpenseForm>>this.billingFormArr.parent;
        this.parentAmountCtrl.valueChanges.subscribe(_ => this.recalculateBillingAmount());
        this.parentCycleCtrl.valueChanges.subscribe(_ => this.recalculateBillingAmount());
        this.initCreateForm();
    }

    addBillingForm(): void {
        const billingForm = this.buildBillingForm();
        this.billingFormArr.push(billingForm);

        this.recalculateBillingAmount();
    }

    removeBillingForm(formIdx: number): void {
        this.billingFormArr.removeAt(formIdx);

        this.recalculateBillingAmount();
    }

    recalculateBillingAmount(): void {
        const parentFormValue = this.parentForm.getRawValue();
        const amount = parentFormValue.amount!;
        const cycle = parentFormValue.cycle!;
        const totalBilling = this.billingFormArr.controls.length;
        let averageBilling: NullableNumber;

        if (!amount) {
            averageBilling = null;
        } else if (amount && !cycle) {
            averageBilling = amount / totalBilling;
        } else if (amount && cycle) {
            averageBilling = (amount / cycle) / totalBilling;
        }
        this.billingFormArr.controls.forEach(control => control.controls.amount.setValue(averageBilling));
    }

    get parentAmountCtrl(): NullableNumberFormControl {
        return this.parentForm.controls.amount;
    }

    get parentCycleCtrl(): NullableNumberFormControl {
        return this.parentForm.controls.cycle;
    }

    get parentPaidByCtrl(): NullableUserInfoFormControl {
        return this.parentForm.controls.paidBy;
    }

    private initCreateForm(): void {
        this.billingFormArr.push(this.buildBillingForm());
    }

    private buildBillingForm(isDisabled = false): FormGroup<BillingForm> {
        return this.fb.group({ 
            user: this.fb.control<NullableUserInfo>({ value: null, disabled: isDisabled }, [Validators.required]), 
            amount: this.fb.control<NullableNumber>({ value: null, disabled: isDisabled }) 
        });
    }

}
