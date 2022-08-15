import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation, Input, ViewChild, AfterViewInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { map, Observable } from "rxjs";
import { Action } from "src/app/common/enum/action";
import { NullableDateStructFormControl, NullableMeta, NullableNumber, NullableNumberFormControl, NullableString, NullableStringFormControl, NullableUserInfo, NullableUserInfoFormControl } from "src/app/common/types/common.type";
import { getDateStruct } from "src/app/common/utils/date-struct.util";
import { getDate, getDateFromDateStruct } from "src/app/common/utils/date.util";
import { ToastService } from "src/app/core/toast/toast.service";
import { AttachmentUpload, AttachmentUploadForm, Expense, ExpenseForm, ExpenseFormValue, Sharing, SharingForm } from "../../model/expense.model";
import { AddAttachmentSectionComponent } from "../add-attachment-section/add-attachment-section.component";
import { SharingSectionComponent } from "../sharing-section/sharing-section.component";

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

    @ViewChild(SharingSectionComponent)
    sharingSection!: SharingSectionComponent;

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
        const sharings = this.processSharingBeforeClose(formValue.sharings);
        this.activeModal.close({
            ...formValue,
            date: getDateFromDateStruct(formValue.date!),
            paidBy: formValue.paidBy?.uid,
            files,
            sharings
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

    get sharingsFormArr(): FormArray<FormGroup<SharingForm>> {
        return this.expenseForm.controls.sharings;
    }

    private validateForm(): void {
        const formValue = this.expenseForm.getRawValue();
        const sharings = formValue.sharings;
        const totalSharingAmount = sharings.map(sharing => sharing.amount).reduce((prev, cur) => prev! + cur!, 0);
        if (formValue.amount !== totalSharingAmount) {
            this.toastService.showWarning(`Total sharing amoumt ${totalSharingAmount} not match with expense amount ${formValue.amount}`);
            throw 'Total amount not match with expense amount';
        }

        const duplicateNames = sharings.map(sharing => sharing.user)
            .map(user => user?.displayName)
            .filter((displayName, idx, arr) => arr.indexOf(displayName) !== idx);
        if (duplicateNames[0]) {
            this.toastService.showWarning(`${duplicateNames.join(',')} has duplicated in sharing section.`);
            throw 'Duplicate user in section';
        }
    }

    private initEditForm(): void {
        const formValue = this.expense;
        this.expenseForm.patchValue(formValue);
        this.addAttachmentSection.patchValue(formValue.files);
        this.sharingSection.patchValue(formValue.sharings);
    }

    private processFilesBeforeClose(files: AttachmentUpload[]): AttachmentUpload[] {
        return files.map(file => ({ ...file, name: file.name || file.file?.name! }));
    }

    private processSharingBeforeClose(sharings: { user: NullableUserInfo, amount: NullableNumber }[]): Sharing[] {
        return sharings.map(sharing => ({ user: sharing.user?.uid!, amount: sharing.amount! }));
    }

    private buildExpenseForm(): FormGroup<ExpenseForm> {
        return this.fb.group({
            name: this.fb.control<NullableString>({ value: null, disabled: false }, [Validators.required]),
            amount: this.fb.control<NullableNumber>({ value: null, disabled: false }, [Validators.required]),
            date: this.fb.control({ value: getDateStruct(), disabled: false }, [Validators.required]),
            paidBy: this.fb.control<NullableUserInfo>({ value: null, disabled: false }, [Validators.required]),
            files: this.fb.array<FormGroup<AttachmentUploadForm>>([]),
            sharings: this.fb.array<FormGroup<SharingForm>>([]),
            meta: this.fb.control<NullableMeta>({ value: {}, disabled: true })
        });
    }

}
