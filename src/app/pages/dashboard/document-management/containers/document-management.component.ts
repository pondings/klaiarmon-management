import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from "@angular/core";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { Observable } from "rxjs";
import { DocumentDto, DocumentSearch } from "../models/document.model";
import { DocumentManagementService } from "../services/document-management.service";

@Component({
    selector: 'app-document-management',
    templateUrl: './document-management.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class DocumentManagementComponent implements OnInit {

    faAdd = faAdd;

    documents$!: Observable<DocumentDto[]>;

    constructor(private documentService: DocumentManagementService) {}

    ngOnInit(): void {
        this.documents$ = this.documentService.subscribeDocument();
    }

    async search(criteria: DocumentSearch): Promise<void> {
        await this.documentService.searchDocument(criteria);
    }

    clear(): void {
        this.documentService.clearSearchResult();
    }

    deleteDocument(document: DocumentDto): void {
        this.documentService.deleteDocument(document);
    }

    async openAddDocumentModal(): Promise<void> {
        await this.documentService.openAddDocumentModal();
    }
    
}
