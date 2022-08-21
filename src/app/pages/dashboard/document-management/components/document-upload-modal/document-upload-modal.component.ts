import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { DomSanitizer } from "@angular/platform-browser";
import { faEye, faFileUpload } from "@fortawesome/free-solid-svg-icons";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Observable } from "rxjs";
import { NullableFile, NullableFileFormControl, NullableString, NullableStringFormControl } from "src/app/common/types/common.type";
import { inputFileToBlob } from "src/app/common/utils/file-util";
import { isFormValid } from "src/app/common/utils/form-util";
import { ImageViewerComponent } from "src/app/shared/components/image-viewer/image-viewer.component";
import { DocumentUploadForm } from "../../models/document.model";

@Component({
    selector: 'app-document-upload-modal',
    templateUrl: './document-upload-modal.component.html',
    styles: ['app-document-upload-modal .upload-btn { border-top-right-radius: 4px !important; border-bottom-right-radius: 4px !important; }'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class DocumentUploadModalComponent implements OnInit {

    documentUploadForm: FormGroup<DocumentUploadForm>;

    isFormValid$!: Observable<boolean>;

    faFileUpload = faFileUpload;
    faEye = faEye;

    constructor(private activeModal: NgbActiveModal,
        private modalService: NgbModal,
        private domSanitizer: DomSanitizer,
        private cdr: ChangeDetectorRef,
        private fb: FormBuilder) {
        this.documentUploadForm = this.buildDocumentUploadForm();        
    }

    ngOnInit(): void {
        this.isFormValid$ = this.documentUploadForm.statusChanges.pipe(isFormValid);
    }
    
    submit(): void {
        const formValue = this.documentUploadForm.getRawValue();
        this.activeModal.close(formValue);
    }

    viewAttachment(): void {
        const modalRef = this.modalService.open(ImageViewerComponent, { centered: true });
        modalRef.componentInstance.imgUrl = this.domSanitizer.bypassSecurityTrustUrl(this.urlCtrl.value!);
    }

    async uploadAttachment(event: Event): Promise<void> {
        const files = (<HTMLInputElement> event.target).files;
        const file = files?.item(0)!;
        const url = await inputFileToBlob(file);
        
        this.fileCtrl.setValue(file);
        this.urlCtrl.setValue(url);
        this.cdr.detectChanges();
    }

    dismiss(): void {
        this.activeModal.dismiss();
    }

    get fileCtrl(): NullableFileFormControl {
        return this.documentUploadForm.controls.file;
    }

    get urlCtrl(): NullableStringFormControl {
        return this.documentUploadForm.controls.url;
    }

    private buildDocumentUploadForm(): FormGroup<DocumentUploadForm> {
        return this.fb.group({
            name: this.fb.control<NullableString>({ value: null, disabled: false }),
            file: this.fb.control<NullableFile>({ value: null, disabled: false }),
            url: this.fb.control<NullableString>({ value: null, disabled: false })
        });
    }

}
