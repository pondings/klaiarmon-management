import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { takeOnce } from "src/app/common/utils/rxjs-util";
import { HasMetaData } from "src/app/model/meta-data";
import { SpinnerService } from "../spinner/spinner.service";
import { ToastService } from "../toast/toast.service";
import { FirestoreService } from "./firestore.service";

@Injectable()
export class DataService {

    constructor(private firestoreService: FirestoreService,
        private spinnerService: SpinnerService,
        private toastService: ToastService) { }

    getCollection<T>(path: string): Observable<T[]> {
        try {
            this.spinnerService.show();
            return this.firestoreService.getCollection<HasMetaData<T>>(path).pipe(takeOnce(), map(this.mapMeta));
        } catch (error) {
            this.toastService.showError('Error while get collection, Please contact Pondi!');
            throw error;
        } finally {
            this.spinnerService.hide();
        }
    }

    async addDocument<T>(path: string, data: T, toastMessage?: string): Promise<T> {
        try {
            this.spinnerService.show();
            const addedDocument = await this.firestoreService.addDocument(path, data);
            if (toastMessage) this.toastService.showSuccess(toastMessage);
            return addedDocument;
        } catch (error) {
            this.toastService.showError('Error while get collection, Please contact Pondi!');
            throw error;
        } finally {
            this.spinnerService.hide();
        }
    }

    async updateDocument<T>(path: string, data: HasMetaData<T>, toastMessage?: string): Promise<T> {
        try {
            this.spinnerService.show();
            const updatedData = await this.firestoreService.updateDocument(`${path}/${data.meta.documentId}`, data);
            if (toastMessage) this.toastService.showSuccess(toastMessage);
            return updatedData;
        } catch (error) {
            this.toastService.showError('Error while update document, Please contact Pondi!');
            throw error;
        } finally {
            this.spinnerService.hide();
        }
    }

    async deleteDocument(path: string, documentId: string, toastMessage?: string): Promise<void> {
        try {
            this.spinnerService.show();
            await this.firestoreService.deleteDocument(`${path}/${documentId}`);
            if (toastMessage) this.toastService.showSuccess(toastMessage);
        } catch (error) {
            this.toastService.showError('Error while delete document, Please contact Pondi!');
            throw error;
        } finally {
            this.spinnerService.hide();
        }
    }

    mapMeta<T>(dataList: HasMetaData<T>[]): T[] {
        return dataList.map(data => ({ ...data, meta: { ...data.meta, documentId: data._documentId } }));
    }

}
