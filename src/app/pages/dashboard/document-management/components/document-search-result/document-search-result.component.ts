import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewEncapsulation } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { faArrowUpRightFromSquare, faDownload, faEye, faTrash } from "@fortawesome/free-solid-svg-icons";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { FileViewerComponent } from "src/app/shared/components/file-viewer/file-viewer.component";
import { ImageViewerComponent } from "src/app/shared/components/image-viewer/image-viewer.component";
import { DocumentDto } from "../../models/document.model";

@Component({
    selector: 'app-document-search-result',
    templateUrl: './document-search-result.component.html',
    styles: ['app-document-search-result { .upload-by { font-size: 12px !important; } }'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class DocumentSearchResultComponent {

    @Input()
    document!: DocumentDto;

    @Output()
    onDelete = new EventEmitter<DocumentDto>();

    private readonly IMAGE_TYPES = ['image/png', 'image/jpeg'];
    private readonly DOCUMENT_TYPES = [
        'application/pdf',
        'text/csv',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    faTrash = faTrash;
    faEye = faEye;
    faDownload = faDownload;
    faArrowUpRightFromSquare = faArrowUpRightFromSquare;

    isCollapsed = true;

    constructor(private modalService: NgbModal,
        private domSanitizer: DomSanitizer) {}

    viewDocument(): void {
        const { type, url } = this.document;

        if (this.IMAGE_TYPES.includes(type)) {
            const modalRef = this.modalService.open(ImageViewerComponent, { centered: true, backdrop: 'static' });
            modalRef.componentInstance.imgUrl = this.domSanitizer.bypassSecurityTrustUrl(url!);
        } else if (this.DOCUMENT_TYPES.includes(type)) {
            const modalRef = this.modalService.open(FileViewerComponent, { centered: true ,backdrop: 'static' });
            modalRef.componentInstance.fileUrl = url;
        } else {
            alert('This file cant preview!');
        }
    }

    deleteDocument(): void {
        this.onDelete.emit(this.document);
    }

    get isPreviewable(): boolean {
        return !!this.IMAGE_TYPES.concat(this.DOCUMENT_TYPES)
            .find(type => this.document.type === type);
    }

}
