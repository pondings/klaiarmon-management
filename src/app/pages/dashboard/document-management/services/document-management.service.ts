import { Injectable } from "@angular/core";
import { QueryFn } from "@angular/fire/compat/firestore";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import * as moment from "moment";
import { BehaviorSubject, Observable } from "rxjs";
import { filterByIgnoreCase } from "src/app/common/utils/common-util";
import { getMoment } from "src/app/common/utils/moment.util";
import { takeOnce } from "src/app/common/utils/rxjs-util";
import { DataService } from "src/app/core/services/data-service";
import { FireStorageService } from "src/app/core/services/fire-storage.service";
import { ToastService } from "src/app/core/toast/toast.service";
import { DocumentUploadModalComponent } from "../components/document-upload-modal/document-upload-modal.component";
import { Document, DocumentDto, DocumentSearch } from "../models/document.model";

@Injectable()
export class DocumentManagementService {

    private static readonly DOCUMENT_COLLECTION_PATH = 'documents';
    private static readonly DOCUMENT_STORAGE_PATH = 'document';

    document$ = new BehaviorSubject<DocumentDto[]>([]);

    constructor(private dataService: DataService,
        private storageService: FireStorageService,
        private toastService: ToastService,
        private modalService: NgbModal) {
    }

    subscribeDocument(): Observable<DocumentDto[]> {
        return this.document$.asObservable();
    }

    async searchDocument(criteria: DocumentSearch): Promise<void> {
        const criteriaQuery: QueryFn = ref => {
            let query: firebase.default.firestore.CollectionReference | firebase.default.firestore.Query = ref;
            if (criteria.uploadBy) query = query.where('meta.createdBy', '==', criteria.uploadBy);
            if (criteria.startDate) query = query.where('meta.createdDate', '>=', moment(criteria.startDate).startOf('day').toDate());
            if (criteria.endDate) query = query.where('meta.createdDate', '<=', moment(criteria.endDate).endOf('day').toDate());
            return query.orderBy('meta.createdDate', 'desc');
        };

        let collection = await this.dataService.getCollection<Document>(DocumentManagementService.DOCUMENT_COLLECTION_PATH, { showSpinner: true, query: criteriaQuery });
        if (criteria.name) collection = collection.filter(filterByIgnoreCase('name', criteria.name));
        if (!collection[0]) this.toastService.showSuccess('No data found');
        this.document$.next(collection);
    }

    async addDocument(documentDto: DocumentDto): Promise<void> {
        const date = getMoment();
        const name = documentDto.name;
        const path = `${DocumentManagementService.DOCUMENT_STORAGE_PATH}/${documentDto.name}`;

        try {
            const existingFile = await this.storageService.getDownloadUrl(path);
            if (existingFile) {
                const confirmation = confirm('This file name is duplicated. Do you want to overwrite this file?');
                if (!confirmation) return;

                const oldDocument = await this.getDocumentByPath(path);
                await this.deleteDocument(oldDocument, true);
            }
        } catch (err) {
            if (err !== 'storage/object-not-found') return;
        }

        const url = await this.storageService.uploadFile(path, documentDto.file!);
        const type = documentDto.file?.type!;

        const document: Document = { name, path, url, type, meta: {} };
        await this.dataService.addDocument(DocumentManagementService.DOCUMENT_COLLECTION_PATH, document,
            { showSpinner: true, toastMessage: 'Document added' });
        this.document$.pipe(takeOnce()).subscribe(docs => 
            this.document$.next([document, ...docs]));
    }

    async deleteDocument(documentDto: DocumentDto, isDeleteForReplace = false): Promise<void> {
        if (!isDeleteForReplace) {
            const confirmation = confirm('After confirm the content will be deleted from the system.');
            if (!confirmation) return;
        }

        await this.storageService.deleteFile(documentDto.path);
        await this.dataService.deleteDocument(DocumentManagementService.DOCUMENT_COLLECTION_PATH, documentDto.meta.documentId!);
        
        if (!isDeleteForReplace) {
            this.toastService.showSuccess('Document deleted');
        }
        this.document$.pipe(takeOnce()).subscribe(documents =>
            this.document$.next(documents.filter(doc => doc.meta.documentId !== documentDto.meta.documentId)));
    }

    async getDocumentByPath(path: string): Promise<DocumentDto> {
        const criteriaQuery: QueryFn = ref => ref.where('path', '==', path);
        const collection = await this.dataService.getCollection<Document>(DocumentManagementService.DOCUMENT_COLLECTION_PATH, 
            { showSpinner: true, query: criteriaQuery });
        return collection.at(0)!;
    }

    clearSearchResult(): void {
        this.document$.next([]);
    }

    async openAddDocumentModal(): Promise<void> {
        const modalRef = this.modalService.open(DocumentUploadModalComponent, { centered: true, backdrop: 'static' });

        await modalRef.result.then(async (dto: DocumentDto) => {
            await this.addDocument(dto);
        }, err => {});
    }

}
