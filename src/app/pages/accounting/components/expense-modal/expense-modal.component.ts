import { ChangeDetectionStrategy, Component, ViewEncapsulation } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { faCalendar, faEye, faFileUpload, faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { NullableDateStructFormControl, NullableFile, NullableNumber, NullableString, NullableUserInfo, NullableUserInfoFormControl } from "src/app/common/types/common.type";
import { getDateStruct } from "src/app/common/utils/date-struct.util";
import { inputFileToBlob } from "src/app/common/utils/file-util";
import { ExpenseAddForm, PhotoUploadForm } from "../../model/expense.model";

@Component({
    selector: 'app-expense-modal',
    templateUrl: './expense-modal.component.html',
    styleUrls: ['./expense-modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class ExpenseModalComponent {

    expenseAddForm: FormGroup<ExpenseAddForm>;

    faCalendar = faCalendar;
    faPlus = faPlus;
    faFileUpload = faFileUpload;
    faXmark = faXmark;
    faEye = faEye;

    today = getDateStruct();

    constructor(private fb: FormBuilder,
        private activeModal: NgbActiveModal) {
        this.expenseAddForm = this.buildExpenseAddForm();
    }

    addFileForm(): void {
        this.filesFormArr.controls.push(this.buildPhotoForm());
    }

    async uploadPhoto(event: Event, form: FormGroup<PhotoUploadForm>): Promise<void> {
        const files = (<HTMLInputElement> event.target).files;
        const file = files?.item(0)!;
        const url = await inputFileToBlob(file);

        form.controls.photoUrl?.setValue(url);
        form.controls.file.setValue(file);
    }

    clearUploadPhoto(form: FormGroup<PhotoUploadForm>): void {
        form.controls.file.reset();
        form.controls.photoUrl.reset();
    }

    dismiss(): void {
        this.activeModal.dismiss();
    }

    get dateCtrl(): NullableDateStructFormControl {
        return this.expenseAddForm.controls.date;
    }

    get paidByCtrl(): NullableUserInfoFormControl {
        return this.expenseAddForm.controls.paidBy;
    }

    get filesFormArr(): FormArray<FormGroup<PhotoUploadForm>> {
        return this.expenseAddForm.controls.files;
    }

    private buildExpenseAddForm(): FormGroup<ExpenseAddForm> {
        return this.fb.group({
            name: this.fb.control<NullableString>({ value: null, disabled: false }, [Validators.required]),
            amount: this.fb.control<NullableNumber>({ value: null, disabled: false }, [Validators.required]),
            date: this.fb.control({ value: getDateStruct(), disabled: false }, [Validators.required]),
            paidBy: this.fb.control<NullableUserInfo>({ value: null, disabled: false }, [Validators.required]),
            isPersonalDebt: this.fb.control({ value: false, disabled: false }),
            files: this.fb.array<FormGroup<PhotoUploadForm>>([this.buildPhotoForm(), this.buildPhotoForm()])
        });
    }

    private buildPhotoForm(): FormGroup<PhotoUploadForm> {
        return this.fb.group({
            name: this.fb.control<NullableString>({ value: null, disabled: false }),
            file: this.fb.control<NullableFile>({ value: null, disabled: false }),
            photoUrl: this.fb.control<NullableString>({ value: null, disabled: false })
        })
    }

}
