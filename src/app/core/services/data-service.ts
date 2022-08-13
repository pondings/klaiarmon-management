import { Injectable } from "@angular/core";
import { Timestamp } from "firebase/firestore";
import { map, Observable, tap } from "rxjs";
import { getDate } from "src/app/common/utils/date.util";
import { HasMetaData } from "src/app/model/meta-data";
import { SpinnerService } from "../spinner/spinner.service";
import { ToastService } from "../toast/toast.service";
import { FireAuthService } from "./fire-auth.service";
import { FirestoreService } from "./firestore.service";
import { QueryFn } from "@angular/fire/compat/firestore";

export interface DataServiceOptions<T = any> {
    showSpinner?: boolean;
    toastMessage?: string;
    query?: QueryFn;
}

@Injectable()
export class DataService {

    constructor(private firestoreService: FirestoreService,
        private fireAuthService: FireAuthService,
        private spinnerService: SpinnerService,
        private toastService: ToastService) { }

    getCollection<T>(path: string, options: DataServiceOptions = { showSpinner: true }): Observable<T[]> {
        try {
            if (options?.showSpinner) this.spinnerService.show();
            return this.firestoreService.getCollection<HasMetaData<T>>(path, options.query)
                .pipe(tap(() => this.spinnerService.hide()), map(this.mapMeta));
        } catch (error) {
            this.spinnerService.hide();
            this.toastService.showError('Error while geting collection, Please contact Pondi!');
            throw error;
        }
    }

    async addDocument<T>(path: string, data: HasMetaData<T>, options: DataServiceOptions = { showSpinner: true }): Promise<T> {
        try {
            if (options?.showSpinner) this.spinnerService.show();
            const dataWithMeta = await this.setMeta(data);
            const addedDocument = await this.firestoreService.addDocument(path, dataWithMeta);
            if (options?.toastMessage) this.toastService.showSuccess(options?.toastMessage);
            return addedDocument;
        } catch (error) {
            this.toastService.showError('Error while adding document, Please contact Pondi!');
            throw error;
        } finally {
            if (options?.showSpinner) this.spinnerService.hide();
        }
    }

    async updateDocument<T>(path: string, data: HasMetaData<T>, options: DataServiceOptions = { showSpinner: true }): Promise<T> {
        try {
            if (options?.showSpinner) this.spinnerService.show();
            const dataWithMeta = await this.setMeta(data);
            const updatedData = await this.firestoreService.updateDocument(`${path}/${data.meta.documentId}`, dataWithMeta);
            if (options?.toastMessage) this.toastService.showSuccess(options?.toastMessage);
            return updatedData;
        } catch (error) {
            this.toastService.showError('Error while updating document, Please contact Pondi!');
            throw error;
        } finally {
            if (options?.showSpinner) this.spinnerService.hide();
        }
    }

    async deleteDocument(path: string, documentId: string, options: DataServiceOptions = { showSpinner: true }): Promise<void> {
        try {
            if (options?.showSpinner) this.spinnerService.show();
            await this.firestoreService.deleteDocument(`${path}/${documentId}`);
            if (options?.toastMessage) this.toastService.showSuccess(options?.toastMessage);
        } catch (error) {
            this.toastService.showError('Error while deleting document, Please contact Pondi!');
            throw error;
        } finally {
            if (options?.showSpinner) this.spinnerService.hide();
        }
    }

    async setMeta<T>(data: HasMetaData<T>): Promise<T> {
        const currentDate = Timestamp.fromDate(getDate()!);
        const user = this.fireAuthService.getCurrentUser();

        const { createdDate = currentDate, createdBy = user.uid } = data.meta;
        data.meta = {
            ...data.meta,
            createdDate,
            createdBy,
            updatedBy: user.uid,
            updatedDate: currentDate
        };
        return data;
    }

    mapMeta<T>(dataList: HasMetaData<T>[]): T[] {
        return dataList.map(data => ({ ...data, meta: { ...data.meta, documentId: data._documentId } }));
    }

}
