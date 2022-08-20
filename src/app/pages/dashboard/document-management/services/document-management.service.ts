import { Injectable } from "@angular/core";
import { QueryFn } from "@angular/fire/compat/firestore";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { BehaviorSubject, Observable } from "rxjs";
import { filterByEqual } from "src/app/common/utils/common-util";
import { getMoment } from "src/app/common/utils/moment.util";
import { DataService } from "src/app/core/services/data-service";
import { FireStorageService } from "src/app/core/services/fire-storage.service";
import { DocumentUploadModalComponent } from "../components/document-upload-modal/document-upload-modal.component";
import { Document, DocumentDto, DocumentSearch } from "../models/document.model";

@Injectable()
export class DocumentManagementService {

    private static readonly DOCUMENT_COLLECTION_PATH = 'documents';
    private static readonly DOCUMENT_STORAGE_PATH = 'document';

    document$ = new BehaviorSubject<DocumentDto[]>([]);

    constructor(private dataService: DataService,
        private storageService: FireStorageService,
        private modalService: NgbModal) {
    }

    subscribeDocument(): Observable<DocumentDto[]> {
        return this.document$.asObservable();
    }

    async fetchDocument(criteria: DocumentSearch): Promise<void> {
        const criteriaQuery: QueryFn = ref => {
            let query: firebase.default.firestore.CollectionReference | firebase.default.firestore.Query = ref;
            if (criteria.uploadBy) query = query.where('meta.createdBy', '==', criteria.uploadBy);
            if (criteria.startDate) query = query.where('meta.createdDate', '>=', criteria.startDate);
            if (criteria.endDate) query = query.where('meta.createdDate', '<=', criteria.endDate);
            return ref.orderBy('meta.createdDate', 'desc');
        };

        let collection = await this.dataService.getCollection<Document>(DocumentManagementService.DOCUMENT_COLLECTION_PATH, { showSpinner: true, query: criteriaQuery });
        if (criteria.name) collection = collection.filter(filterByEqual('name', criteria.name));
        this.document$.next(collection);
    }

    async addDocument(documentDto: DocumentDto): Promise<void> {
        const date = getMoment();
        const name = documentDto.name;
        const path = `${DocumentManagementService.DOCUMENT_STORAGE_PATH}/${date?.get('month')! + 1}/${documentDto.name}`;
        const url = await this.storageService.uploadFile(path, documentDto.file!);
        const type = documentDto.file?.type!;

        const document: Document = { name, path, url, type, meta: {} };
        await this.dataService.addDocument(DocumentManagementService.DOCUMENT_COLLECTION_PATH, document,
            { showSpinner: true, toastMessage: 'Document added' });
    }

    async deleteDocument(documentDto: DocumentDto): Promise<void> {
        await this.storageService.deleteFile(documentDto.path);
        await this.dataService.deleteDocument(DocumentManagementService.DOCUMENT_COLLECTION_PATH, documentDto.meta.documentId!,
            { showSpinner: true, toastMessage: 'Document deleted' });
    }

    async openAddDocumentModal(): Promise<void> {
        const modalRef = this.modalService.open(DocumentUploadModalComponent, { centered: true, backdrop: 'static' });

        await modalRef.result.then(async (dto: DocumentDto) => {
            await this.addDocument(dto);
        });
    }

}
