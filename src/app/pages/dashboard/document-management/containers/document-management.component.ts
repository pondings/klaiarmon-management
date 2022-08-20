import { ChangeDetectionStrategy, Component, ViewEncapsulation } from "@angular/core";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { DocumentManagementService } from "../services/document-management.service";

@Component({
    selector: 'app-document-management',
    templateUrl: './document-management.component.html',
    styleUrls: ['./document-management.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class DocumentManagementComponent {

    faAdd = faAdd;

    constructor(private documentService: DocumentManagementService) {}

    async openAddDocumentModal(): Promise<void> {
        await this.documentService.openAddDocumentModal();
    }
    
}
