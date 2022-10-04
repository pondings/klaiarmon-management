import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewEncapsulation } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { faCircleMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { UntilDestroy } from "@ngneat/until-destroy";
import { map, Observable } from "rxjs";
import { Action } from "src/app/common/enum/action";
import { NullableNumber, NullableNumberFormControl, NullableStringFormControl, NullableUserInfo, NullableUserInfoFormControl } from "src/app/common/types/common.type";
import { ExpenseForm, BillingForm, BillingFormValue } from "../../model/expense.model";

@UntilDestroy({ checkProperties: true })
@Component({
    selector: 'app-billing-section',
    templateUrl: './billing-section.component.html',
    styleUrls: ['billing-section.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class BillingSectionComponent implements OnInit {

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

    private parentForm!: FormGroup<ExpenseForm>;

    constructor(private fb: FormBuilder,
        private cdr: ChangeDetectorRef) { }

    ngOnInit(): void {
        this.parentForm = <FormGroup<ExpenseForm>>this.billingFormArr.parent;
        this.parentAmountCtrl.valueChanges.subscribe(amount => this.recalculateBillingAmount(amount!));
        this.overRemain$ = this.getOverRemain();

        if (this.action === Action.CREATE) {
            this.initCreateForm();
        }
    }

    addBillingForm(): void {
        const billingForm = this.buildBillingForm();
        this.billingFormArr.push(billingForm);

        this.recalculateBillingAmount(this.parentAmountCtrl.value!);
    }

    removeBillingForm(formIdx: number): void {
        this.billingFormArr.removeAt(formIdx);

        this.recalculateBillingAmount(this.parentAmountCtrl.value!);
    }

    recalculateBillingAmount(amount: number): void {
        if (this.action === Action.VIEW) return;

        const totalBilling = this.billingFormArr.controls.length;
        if (!totalBilling) return;

        const averageBilling = amount / totalBilling;
        this.billingFormArr.controls.forEach(control => control.controls.amount.setValue(averageBilling));
    }

    get parentAmountCtrl(): NullableNumberFormControl {
        return this.parentForm.controls.amount;
    }

    get parentPaidByCtrl(): NullableUserInfoFormControl {
        return this.parentForm.controls.paidBy;
    }

    get isAlertMode(): boolean {
        return this.action === Action.EXPENSE_ALERT;
    }

    patchValue(billingList: BillingFormValue[]): void {
        billingList.forEach(_ => this.addBillingForm());
        this.billingFormArr.patchValue(billingList);
        this.cdr.detectChanges();
    }

    disable(): void {
        this.billingFormArr.disable();
    }

    enableAmount(): void {
        this.billingFormArr.controls.forEach(group => group.controls.amount.enable());
    }

    private initCreateForm(): void {
        this.billingFormArr.push(this.buildBillingForm());
    }

    private getOverRemain(): Observable<string> {
        return this.billingFormArr.valueChanges.pipe(map(billingFormArr => {
            const parentAmount = this.parentAmountCtrl.value;
            const totalBillingAmount = billingFormArr.map(billingForm => billingForm.amount).reduce((prev, cur) => prev! + cur!, 0);
            const diff = parentAmount! - totalBillingAmount!;

            return diff > 0 ? `Remaining ${diff}` : diff < 0 ? `Over ${Math.abs(diff)}` : '';
        }));
    }

    private buildBillingForm(isDisabled = false): FormGroup<BillingForm> {
        return this.fb.group({ 
            user: this.fb.control<NullableUserInfo>({ value: null, disabled: isDisabled }, [Validators.required]), 
            amount: this.fb.control<NullableNumber>({ value: null, disabled: isDisabled }, this.isRequireAmount ? [Validators.required] : []) 
        });
    }

}
