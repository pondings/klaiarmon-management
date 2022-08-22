import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewEncapsulation } from "@angular/core";
import { faArrowUpRightFromSquare, faDownload, faTrash } from "@fortawesome/free-solid-svg-icons";
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

    faTrash = faTrash;
    faDownload = faDownload;
    faArrowUpRightFromSquare = faArrowUpRightFromSquare;

    isCollapsed = true;

    deleteDocument(): void {
        this.onDelete.emit(this.document);
    }

}
