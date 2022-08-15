import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewEncapsulation } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { faCircleMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { UntilDestroy } from "@ngneat/until-destroy";
import { map, Observable } from "rxjs";
import { Action } from "src/app/common/enum/action";
import { NullableNumber, NullableNumberFormControl, NullableUserInfo, NullableUserInfoFormControl } from "src/app/common/types/common.type";
import { takeOnce } from "src/app/common/utils/rxjs-util";
import { ExpenseForm, SharingForm, SharingFormValue } from "../../model/expense.model";

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

    @Input()
    action!: Action;

    faPlus = faPlus;
    faCircleMinus = faCircleMinus;

    overRemain$!: Observable<string>;

    private parentForm!: FormGroup<ExpenseForm>;

    constructor(private fb: FormBuilder,
        private cdr: ChangeDetectorRef) { }

    ngOnInit(): void {
        this.parentForm = <FormGroup<ExpenseForm>>this.sharingFormArr.parent;
        this.parentAmountCtrl.valueChanges.subscribe(amount => this.recalculateSharingAmount(amount!));
        this.overRemain$ = this.getOverRemain();

        if (this.action === Action.CREATE) {
            this.initCreateForm();
        }
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

    patchValue(sharings: SharingFormValue[]): void {
        sharings.forEach(_ => this.addSharingForm());
        this.sharingFormArr.patchValue(sharings);
        this.cdr.detectChanges();
    }

    private initCreateForm(): void {
        const disabledSharingForm = this.buildSharingForm(true);
        this.sharingFormArr.push(disabledSharingForm);

        this.parentPaidByCtrl.valueChanges.pipe(takeOnce()).subscribe(paidBy => {
            disabledSharingForm.enable();
            disabledSharingForm.controls.user.setValue(paidBy);
        });
    }

    private getOverRemain(): Observable<string> {
        return this.sharingFormArr.valueChanges.pipe(map(sharingFormArr => {
            const parentAmount = this.parentAmountCtrl.value;
            const totalSharingAmount = sharingFormArr.map(sharingForm => sharingForm.amount).reduce((prev, cur) => prev! + cur!, 0);
            const diff = parentAmount! - totalSharingAmount!;

            return diff > 0 ? `Remaining ${diff}` : diff < 0 ? `Over ${Math.abs(diff)}` : '';
        }));
    }

    private buildSharingForm(isDisabled = false): FormGroup<SharingForm> {
        return this.fb.group({
            user: this.fb.control<NullableUserInfo>({ value: null, disabled: isDisabled }, [Validators.required]),
            amount: this.fb.control<NullableNumber>({ value: null, disabled: isDisabled }, [Validators.required])
        });
    }

}
