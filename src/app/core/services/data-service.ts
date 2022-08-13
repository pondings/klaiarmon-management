import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { HasMetaData } from "src/app/model/meta-data";
import { SpinnerService } from "../spinner/spinner.service";
import { ToastService } from "../toast/toast.service";
import { FirestoreService } from "./firestore.service";

export interface DataServiceOptions {
    showSpinner?: boolean;
    toastMessage?: string;
}

@Injectable()
export class DataService {

    constructor(private firestoreService: FirestoreService,
        private spinnerService: SpinnerService,
        private toastService: ToastService) { }

    getCollection<T>(path: string, options?: DataServiceOptions): Observable<T[]> {
        try {
            if (options?.showSpinner) this.spinnerService.show();
            return this.firestoreService.getCollection<HasMetaData<T>>(path).pipe(map(this.mapMeta));
        } catch (error) {
            this.toastService.showError('Error while get collection, Please contact Pondi!');
            throw error;
        } finally {
            if (options?.showSpinner) this.spinnerService.hide();
        }
    }

    async addDocument<T>(path: string, data: T, options?: DataServiceOptions): Promise<T> {
        try {
            if (options?.showSpinner) this.spinnerService.show();
            const addedDocument = await this.firestoreService.addDocument(path, data);
            if (options?.toastMessage) this.toastService.showSuccess(options?.toastMessage);
            return addedDocument;
        } catch (error) {
            this.toastService.showError('Error while get collection, Please contact Pondi!');
            throw error;
        } finally {
            if (options?.showSpinner) this.spinnerService.hide();
        }
    }

    async updateDocument<T>(path: string, data: HasMetaData<T>, options?: DataServiceOptions): Promise<T> {
        try {
            if (options?.showSpinner) this.spinnerService.show();
            const updatedData = await this.firestoreService.updateDocument(`${path}/${data.meta.documentId}`, data);
            if (options?.toastMessage) this.toastService.showSuccess(options?.toastMessage);
            return updatedData;
        } catch (error) {
            this.toastService.showError('Error while update document, Please contact Pondi!');
            throw error;
        } finally {
            if (options?.showSpinner) this.spinnerService.hide();
        }
    }

    async deleteDocument(path: string, documentId: string, options?: DataServiceOptions): Promise<void> {
        try {
            if (options?.showSpinner) this.spinnerService.show();
            await this.firestoreService.deleteDocument(`${path}/${documentId}`);
            if (options?.toastMessage) this.toastService.showSuccess(options?.toastMessage);
        } catch (error) {
            this.toastService.showError('Error while delete document, Please contact Pondi!');
            throw error;
        } finally {
            if (options?.showSpinner) this.spinnerService.hide();
        }
    }

    mapMeta<T>(dataList: HasMetaData<T>[]): T[] {
        return dataList.map(data => ({ ...data, meta: { ...data.meta, documentId: data._documentId } }));
    }

}
