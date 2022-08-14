import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from "@angular/core";
import { FormArray, FormBuilder, FormGroup } from "@angular/forms";
import { DomSanitizer } from "@angular/platform-browser";
import { faCircleMinus, faEye, faFileUpload, faPlus } from "@fortawesome/free-solid-svg-icons";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { NullableFile, NullableString } from "src/app/common/types/common.type";
import { inputFileToBlob } from "src/app/common/utils/file-util";
import { ImageViewerComponent } from "src/app/shared/components/image-viewer/image-viewer.component";
import { PhotoUploadForm } from "../../model/expense.model";

@Component({
    selector: 'app-add-photo-section',
    templateUrl: 'add-photo-section.component.html',
    styleUrls: ['add-photo-section.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class AddPhotoSectionComponent {

    @Input()
    fileFormArr!: FormArray<FormGroup<PhotoUploadForm>>;

    faPlus = faPlus;
    faFileUpload = faFileUpload;
    faEye = faEye;
    faCircleMinus = faCircleMinus;

    constructor(private fb: FormBuilder,
        private modalService: NgbModal,
        private domSanitizer: DomSanitizer) {
    }

    addFileForm(): void {
        const fileForm = this.buildPhotoForm();
        this.fileFormArr.controls.push(fileForm);
    }

    async uploadPhoto(event: Event, form: FormGroup<PhotoUploadForm>): Promise<void> {
        const files = (<HTMLInputElement> event.target).files;
        const file = files?.item(0)!;
        const url = await inputFileToBlob(file);
        
        form.patchValue({ photoUrl: url, file });
    }

    viewPhoto(form: FormGroup<PhotoUploadForm>): void {
        const modalRef = this.modalService.open(ImageViewerComponent, { centered: true });
        modalRef.componentInstance.imgUrl = this.domSanitizer.bypassSecurityTrustUrl(form.controls.photoUrl.value!);
    }

    removeFileForm(formIdx: number): void {
        this.fileFormArr.controls.splice(formIdx, 1);
    }

    private buildPhotoForm(): FormGroup<PhotoUploadForm> {
        return this.fb.group({
            name: this.fb.control<NullableString>({ value: null, disabled: false }),
            file: this.fb.control<NullableFile>({ value: null, disabled: false }),
            photoUrl: this.fb.control<NullableString>({ value: null, disabled: false })
        })
    }

}
