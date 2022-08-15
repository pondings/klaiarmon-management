import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, ViewEncapsulation } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DomSanitizer } from "@angular/platform-browser";
import { faCircleMinus, faEye, faFileUpload, faPlus } from "@fortawesome/free-solid-svg-icons";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { NullableFile, NullableString } from "src/app/common/types/common.type";
import { inputFileToBlob } from "src/app/common/utils/file-util";
import { ImageViewerComponent } from "src/app/shared/components/image-viewer/image-viewer.component";
import { AttachmentUpload, AttachmentUploadForm } from "../../model/expense.model";

@Component({
    selector: 'app-add-attachment-section',
    templateUrl: 'add-attachment-section.component.html',
    styleUrls: ['add-attachment-section.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class AddAttachmentSectionComponent {

    @Input()
    fileFormArr!: FormArray<FormGroup<AttachmentUploadForm>>;

    faPlus = faPlus;
    faFileUpload = faFileUpload;
    faEye = faEye;
    faCircleMinus = faCircleMinus;

    constructor(private fb: FormBuilder,
        private modalService: NgbModal,
        private domSanitizer: DomSanitizer,
        private cdr: ChangeDetectorRef) {
    }

    addFileForm(): void {
        const fileForm = this.buildAttachmentForm();
        this.fileFormArr.push(fileForm);
    }

    async uploadAttachment(event: Event, form: FormGroup<AttachmentUploadForm>): Promise<void> {
        const files = (<HTMLInputElement> event.target).files;
        const file = files?.item(0)!;
        const url = await inputFileToBlob(file);
        
        form.patchValue({ attachmentUrl: url, file });
        this.cdr.detectChanges();
    }

    viewAttachment(form: FormGroup<AttachmentUploadForm>): void {
        const modalRef = this.modalService.open(ImageViewerComponent, { centered: true });
        modalRef.componentInstance.imgUrl = this.domSanitizer.bypassSecurityTrustUrl(form.controls.attachmentUrl.value!);
    }

    removeFileForm(formIdx: number): void {
        this.fileFormArr.removeAt(formIdx);
    }

    patchValue(files: AttachmentUpload[]) {
        files.forEach(_ => this.addFileForm());
        this.fileFormArr.patchValue(files);
        this.cdr.detectChanges();
    }

    getAttchmentUrl(idx: number): string {
        return this.fileFormArr.at(idx).controls.attachmentUrl.value!;
    }

    private buildAttachmentForm(): FormGroup<AttachmentUploadForm> {
        return this.fb.group({
            name: this.fb.control<NullableString>({ value: null, disabled: false }),
            file: this.fb.control<NullableFile>({ value: null, disabled: false }),
            attachmentUrl: this.fb.control<NullableString>({ value: null, disabled: false }, [Validators.required])
        })
    }

}
