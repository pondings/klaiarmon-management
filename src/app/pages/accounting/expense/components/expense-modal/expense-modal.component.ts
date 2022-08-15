import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { map, Observable } from "rxjs";
import { NullableDateStructFormControl, NullableMeta, NullableNumber, NullableNumberFormControl, NullableString, NullableStringFormControl, NullableUserInfo, NullableUserInfoFormControl } from "src/app/common/types/common.type";
import { getDateStruct } from "src/app/common/utils/date-struct.util";
import { getDate, getDateFromDateStruct } from "src/app/common/utils/date.util";
import { ToastService } from "src/app/core/toast/toast.service";
import { AttachmentUpload, AttachmentUploadForm, ExpenseForm, Sharing, SharingForm } from "../../model/expense.model";

@Component({
    selector: 'app-expense-modal',
    templateUrl: './expense-modal.component.html',
    styleUrls: ['./expense-modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class ExpenseModalComponent implements OnInit {

    expenseAddForm: FormGroup<ExpenseForm>;

    faCalendar = faCalendar;

    isFormValid$!: Observable<boolean>

    today = getDateStruct();

    constructor(private fb: FormBuilder,
        private activeModal: NgbActiveModal,
        private toastService: ToastService) {
        this.expenseAddForm = this.buildExpenseAddForm();
    }

    ngOnInit(): void {
        this.isFormValid$ = this.expenseAddForm.statusChanges.pipe(map(status => status === 'VALID'));
    }

    onAdd(): void {
        this.validateForm();
        const formValue = this.expenseAddForm.getRawValue();

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

    get nameCtrl(): NullableStringFormControl {
        return this.expenseAddForm.controls.name;
    }

    get amountCtrl(): NullableNumberFormControl {
        return this.expenseAddForm.controls.amount;
    }

    get dateCtrl(): NullableDateStructFormControl {
        return this.expenseAddForm.controls.date;
    }

    get paidByCtrl(): NullableUserInfoFormControl {
        return this.expenseAddForm.controls.paidBy;
    }

    get fileFormArr(): FormArray<FormGroup<AttachmentUploadForm>> {
        return this.expenseAddForm.controls.files;
    }

    get sharingsFormArr(): FormArray<FormGroup<SharingForm>> {
        return this.expenseAddForm.controls.sharings;
    }

    private validateForm(): void {
        const formValue = this.expenseAddForm.getRawValue();
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

    private processFilesBeforeClose(files: AttachmentUpload[]): AttachmentUpload[] {
        return files.filter(file => !!file.file)
            .map(file => ({ ...file, name: file.name || file.file?.name!, uploadDate: getDate()! }));
    }

    private processSharingBeforeClose(sharings: { user: NullableUserInfo, amount: NullableNumber }[]): Sharing[] {
        return sharings.map(sharing => ({ user: sharing.user?.uid!, amount: sharing.amount! }));
    }

    private buildExpenseAddForm(): FormGroup<ExpenseForm> {
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
