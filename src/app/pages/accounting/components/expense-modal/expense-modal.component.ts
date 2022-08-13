import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DomSanitizer } from "@angular/platform-browser";
import { faCalendar, faCircleMinus, faEye, faFileUpload, faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { UntilDestroy } from "@ngneat/until-destroy";
import { map, Observable } from "rxjs";
import { NullableDateStructFormControl, NullableFile, NullableMeta, NullableNumber, NullableNumberFormControl, NullableString, NullableStringFormControl, NullableUserInfo, NullableUserInfoFormControl } from "src/app/common/types/common.type";
import { getDateStruct } from "src/app/common/utils/date-struct.util";
import { getDate, getDateFromDateStruct } from "src/app/common/utils/date.util";
import { inputFileToBlob } from "src/app/common/utils/file-util";
import { ToastService } from "src/app/core/toast/toast.service";
import { ImageViewerComponent } from "src/app/shared/components/image-viewer/image-viewer.component";
import { ExpenseForm, PhotoUpload, PhotoUploadForm } from "../../model/expense.model";

@UntilDestroy({ checkProperties: true })
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
    faPlus = faPlus;
    faFileUpload = faFileUpload;
    faEye = faEye;
    faCircleMinus = faCircleMinus;

    isFormValid$!: Observable<boolean>

    today = getDateStruct();

    constructor(private fb: FormBuilder,
        private activeModal: NgbActiveModal,
        private modalService: NgbModal,
        private domSanitizer: DomSanitizer,
        private toastService: ToastService) {
        this.expenseAddForm = this.buildExpenseAddForm();
    }

    ngOnInit(): void {
        this.isFormValid$ = this.expenseAddForm.statusChanges.pipe(map(_ => {
            return !!this.nameCtrl.value && !!this.amountCtrl.value && !!this.dateCtrl.value && !!this.paidByCtrl.value;
        }));
    }

    onAdd(): void {
        const formValue = this.expenseAddForm.getRawValue();
        if (typeof formValue.paidBy === 'string') {
            this.toastService.showError(`Invalid user: ${formValue.paidBy}, Please select from dropdown.`);
            return;
        }

        const files = this.processFilesBeforeClose(formValue.files);
        this.activeModal.close({
            ...formValue,
            date: getDateFromDateStruct(formValue.date!),
            paidBy: formValue.paidBy?.uid,
            files
        });
    }

    addFileForm(): void {
        const fileForm = this.buildPhotoForm();
        fileForm.setParent(this.expenseAddForm);
        this.filesFormArr.controls.push(fileForm);
    }

    async uploadPhoto(event: Event, form: FormGroup<PhotoUploadForm>): Promise<void> {
        const files = (<HTMLInputElement>event.target).files;
        const file = files?.item(0)!;
        const url = await inputFileToBlob(file);

        form.patchValue({ photoUrl: url, file });
    }

    viewPhoto(form: FormGroup<PhotoUploadForm>): void {
        const modalRef = this.modalService.open(ImageViewerComponent, { centered: true });
        modalRef.componentInstance.imgUrl = this.domSanitizer.bypassSecurityTrustUrl(form.controls.photoUrl.value!);
    }

    removeFormArr(formIndex: number): void {
        this.filesFormArr.controls.splice(formIndex, 1);
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

    get filesFormArr(): FormArray<FormGroup<PhotoUploadForm>> {
        return this.expenseAddForm.controls.files;
    }

    private processFilesBeforeClose(files: PhotoUpload[]): PhotoUpload[] {
        return files.filter(file => !!file.file)
            .map(file => ({ ...file, name: file.name || file.file?.name!, uploadDate: getDate()! }));
    }

    private buildExpenseAddForm(): FormGroup<ExpenseForm> {
        return this.fb.group({
            name: this.fb.control<NullableString>({ value: null, disabled: false }, [Validators.required]),
            amount: this.fb.control<NullableNumber>({ value: null, disabled: false }, [Validators.required]),
            date: this.fb.control({ value: getDateStruct(), disabled: false }, [Validators.required]),
            paidBy: this.fb.control<NullableUserInfo>({ value: null, disabled: false }, [Validators.required]),
            isPersonalDebt: this.fb.control({ value: false, disabled: false }),
            files: this.fb.array<FormGroup<PhotoUploadForm>>([]),
            meta: this.fb.control<NullableMeta>({ value: {}, disabled: true })
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
