import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation, Input, ViewChild, AfterViewInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { map, Observable } from "rxjs";
import { Action } from "src/app/common/enum/action";
import { NullableDateStructFormControl, NullableMeta, NullableNumber, NullableNumberFormControl, NullableString, NullableStringFormControl, NullableUserInfo, NullableUserInfoFormControl } from "src/app/common/types/common.type";
import { getDateStruct } from "src/app/common/utils/date-struct.util";
import { getDateFromDateStruct } from "src/app/common/utils/date.util";
import { ToastService } from "src/app/core/toast/toast.service";
import { AttachmentUpload, AttachmentUploadForm, ExpenseForm, ExpenseFormValue, Billing, BillingForm } from "../../model/expense.model";
import { AddAttachmentSectionComponent } from "../add-attachment-section/add-attachment-section.component";
import { BillingSectionComponent } from "../billing-section/billing-section.component";

@Component({
    selector: 'app-expense-modal',
    templateUrl: './expense-modal.component.html',
    styleUrls: ['./expense-modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class ExpenseModalComponent implements OnInit, AfterViewInit {

    @Input()
    action!: Action;

    @Input()
    expense!: ExpenseFormValue;

    @ViewChild(AddAttachmentSectionComponent)
    addAttachmentSection!: AddAttachmentSectionComponent;

    @ViewChild(BillingSectionComponent)
    billingSection!: BillingSectionComponent;

    expenseForm: FormGroup<ExpenseForm>;

    faCalendar = faCalendar;

    isFormValid$!: Observable<boolean>

    today = getDateStruct();

    constructor(private fb: FormBuilder,
        private activeModal: NgbActiveModal,
        private toastService: ToastService) {
        this.expenseForm = this.buildExpenseForm();
    }

    ngOnInit(): void {
        this.isFormValid$ = this.expenseForm.statusChanges.pipe(map(status => status === 'VALID'));
    }

    ngAfterViewInit(): void {
        if (this.action === Action.UPDATE) setTimeout(() => this.initEditForm(), 100);
    }

    onSubmit(): void {
        this.validateForm();
        const formValue = this.expenseForm.getRawValue();

        const files = this.processFilesBeforeClose(formValue.files);
        const billings = this.processBillingBeforeClose(formValue.billings);
        this.activeModal.close({
            ...formValue,
            date: getDateFromDateStruct(formValue.date!),
            paidBy: formValue.paidBy?.uid,
            files,
            billings
        });
    }

    dismiss(): void {
        this.activeModal.dismiss();
    }

    get submitButtonLabel(): string {
        return this.action === Action.CREATE ? 'Add' : 'Edit';
    }

    get nameCtrl(): NullableStringFormControl {
        return this.expenseForm.controls.name;
    }

    get amountCtrl(): NullableNumberFormControl {
        return this.expenseForm.controls.amount;
    }

    get dateCtrl(): NullableDateStructFormControl {
        return this.expenseForm.controls.date;
    }

    get paidByCtrl(): NullableUserInfoFormControl {
        return this.expenseForm.controls.paidBy;
    }

    get fileFormArr(): FormArray<FormGroup<AttachmentUploadForm>> {
        return this.expenseForm.controls.files;
    }

    get billingsFormArr(): FormArray<FormGroup<BillingForm>> {
        return this.expenseForm.controls.billings;
    }

    private validateForm(): void {
        const formValue = this.expenseForm.getRawValue();
        const billings = formValue.billings;
        const totalBillingAmount = billings.map(billing => billing.amount).reduce((prev, cur) => prev! + cur!, 0);
        if (formValue.amount !== totalBillingAmount) {
            this.toastService.showWarning(`Total billing amoumt ${totalBillingAmount} not match with expense amount ${formValue.amount}`);
            throw 'Total amount not match with expense amount';
        }

        const duplicateNames = billings.map(billing => billing.user)
            .map(user => user?.displayName)
            .filter((displayName, idx, arr) => arr.indexOf(displayName) !== idx);
        if (duplicateNames[0]) {
            this.toastService.showWarning(`${duplicateNames.join(',')} has duplicated in billing section.`);
            throw 'Duplicate user in section';
        }
    }

    private initEditForm(): void {
        const formValue = this.expense;
        this.expenseForm.patchValue(formValue);
        this.addAttachmentSection.patchValue(formValue.files);
        this.billingSection.patchValue(formValue.billings);
    }

    private processFilesBeforeClose(files: AttachmentUpload[]): AttachmentUpload[] {
        return files.map(file => ({ ...file, name: file.name || file.file?.name! }));
    }

    private processBillingBeforeClose(billings: { user: NullableUserInfo, amount: NullableNumber }[]): Billing[] {
        return billings.map(billing => ({ user: billing.user?.uid!, amount: billing.amount! }));
    }

    private buildExpenseForm(): FormGroup<ExpenseForm> {
        return this.fb.group({
            name: this.fb.control<NullableString>({ value: null, disabled: false }, [Validators.required]),
            amount: this.fb.control<NullableNumber>({ value: null, disabled: false }, [Validators.required]),
            date: this.fb.control({ value: getDateStruct(), disabled: false }, [Validators.required]),
            paidBy: this.fb.control<NullableUserInfo>({ value: null, disabled: false }, [Validators.required]),
            files: this.fb.array<FormGroup<AttachmentUploadForm>>([]),
            billings: this.fb.array<FormGroup<BillingForm>>([]),
            meta: this.fb.control<NullableMeta>({ value: {}, disabled: true })
        });
    }

}
