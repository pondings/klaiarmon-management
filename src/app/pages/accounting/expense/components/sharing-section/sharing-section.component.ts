import { ChangeDetectionStrategy, Component, Input, OnInit, ViewEncapsulation } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { faCircleMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { UntilDestroy } from "@ngneat/until-destroy";
import { skip } from "rxjs";
import { NullableNumber, NullableNumberFormControl, NullableUserInfo, NullableUserInfoFormControl } from "src/app/common/types/common.type";
import { takeOnce } from "src/app/common/utils/rxjs-util";
import { ExpenseForm, SharingForm } from "../../model/expense.model";

@UntilDestroy({ checkProperties: true })
@Component({
    selector: 'app-sharing-section',
    templateUrl: './sharing-section.component.html',
    styleUrls: ['sharing-section.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class SharingSectionComponent implements OnInit {

    @Input()
    sharingFormArr!: FormArray<FormGroup<SharingForm>>;

    faPlus = faPlus;
    faCircleMinus = faCircleMinus;

    private parentForm!: FormGroup<ExpenseForm>;

    constructor(private fb: FormBuilder) { }

    ngOnInit(): void {
        this.parentForm = <FormGroup<ExpenseForm>>this.sharingFormArr.parent;
        this.parentAmountCtrl.valueChanges.subscribe(amount => this.recalculateSharingAmount(amount!));

        this.initialSharingForm();
    }

    addSharingForm(): void {
        const sharingForm = this.buildSharingForm();
        this.sharingFormArr.push(sharingForm);

        this.recalculateSharingAmount(this.parentAmountCtrl.value!);
    }

    removeSharingForm(formIdx: number): void {
        this.sharingFormArr.controls.splice(formIdx, 1);

        this.recalculateSharingAmount(this.parentAmountCtrl.value!);
    }

    recalculateSharingAmount(amount: number): void {
        const totalSharing = this.sharingFormArr.controls.length;
        if (!totalSharing) return;

        const averageSharing = amount / totalSharing;
        this.sharingFormArr.controls.forEach(control => control.controls.amount.setValue(averageSharing));
    }

    get parentAmountCtrl(): NullableNumberFormControl {
        return this.parentForm.controls.amount;
    }

    get parentPaidByCtrl(): NullableUserInfoFormControl {
        return this.parentForm.controls.paidBy;
    }

    private initialSharingForm(): void {
        const disabledSharingForm = this.buildSharingForm(true);
        this.sharingFormArr.push(disabledSharingForm);

        this.parentPaidByCtrl.valueChanges.pipe(skip(1), takeOnce()).subscribe(paidBy => {
            disabledSharingForm.enable();
            disabledSharingForm.controls.user.setValue(paidBy);
            disabledSharingForm.controls.user.disable();
        });
    }

    private buildSharingForm(isDisabled = false): FormGroup<SharingForm> {
        return this.fb.group({
            user: this.fb.control<NullableUserInfo>({ value: null, disabled: isDisabled }, [Validators.required]),
            amount: this.fb.control<NullableNumber>({ value: null, disabled: isDisabled }, [Validators.required])
        });
    }

}
