import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { BehaviorSubject, finalize, map, Observable, take, tap } from "rxjs";
import { SpinnerService } from "src/app/core/spinner/spinner.service";
import { HasMetaData } from "src/app/model/meta-data";
import { TimeUnit } from "../../shared/model/time-unit";
import { LocalStorageService } from "./local-storage.service";
import * as firebase from 'firebase/firestore';

import * as firestoreUtils from 'src/app/common/utils/firestore.util';
import { ToastService } from "../toast/toast.service";

@Injectable({ providedIn: 'root' })
export class FirestoreService {

    static readonly DOCUMENT_ID_KEY = '_documentId';

    constructor(private angularFirestore: AngularFirestore,
        private angularFireAuth: AngularFireAuth,
        private spinnerService: SpinnerService,
        private toastService: ToastService,
        private localStorageService: LocalStorageService) { }

    subscribeCollection<T>(path: string): Observable<HasMetaData<T>[]> {
        this.spinnerService.show();
        return this.angularFirestore.collection<HasMetaData<T>>(path).valueChanges()
            .pipe(tap(() => this.spinnerService.hide()));
    }

    getCollection<T>(path: string): Observable<HasMetaData<T>[]> {
        this.spinnerService.show();

        const localStorageItem = this.localStorageService.getItem<T[]>(path);
        const observable: Observable<HasMetaData<T>[]> = localStorageItem.isExpired
            ? this.angularFirestore.collection<HasMetaData<T>>(path).valueChanges({ idField: FirestoreService.DOCUMENT_ID_KEY })
                .pipe(map(this.assignDocumentId), tap(dataList => this.setItemWithExpiration(path, dataList)))
            : new BehaviorSubject<HasMetaData<T>[]>(localStorageItem.value as HasMetaData<T>[]).asObservable()
                .pipe(map(dataList => dataList.map(firestoreUtils.convertFirestoreTimestampProperties)));

        return observable.pipe(take(1), finalize(() => this.spinnerService.hide()));
    }

    async deleteDocument(path: string, documentId: string): Promise<ToastService> {
        this.spinnerService.show();
        
        const doc = this.angularFirestore.doc(`${path}/${documentId}`);
        await doc.delete();
        
        this.localStorageService.deleteItem(path, documentId);
        this.spinnerService.hide();
        return this.toastService;
    }

    async addToCollection<T>(path: string, data: HasMetaData<T>[]): Promise<HasMetaData<T>[]> {
        const dataWithoutId = await this.setMetaData(data);
        let cleanedData = dataWithoutId.map(d => firestoreUtils.cleanData(d));

        this.spinnerService.show();

        const batch = this.angularFirestore.firestore.batch();
        const collection = this.angularFirestore.firestore.collection(path);

        cleanedData = cleanedData.map((d: HasMetaData<T>) => {
            const doc = collection.doc();
            batch.set(doc, d);
            d.meta.documentId = doc.id;
            return d;
        })

        await batch.commit();

        this.localStorageService.updateItem(path, cleanedData);
        this.spinnerService.hide();

        return cleanedData;
    }

    private async setMetaData<T>(dataList: HasMetaData<T>[]): Promise<HasMetaData<T>[]> {
        const userInfo = await this.angularFireAuth.currentUser;
        return dataList.map(data => {
            const displayName = userInfo?.displayName!;
            const currentDate = firebase.Timestamp.now();

            const { createdBy = displayName, createdDate = currentDate } = data.meta;
            return <HasMetaData<T>>{
                ...data,
                meta: {
                    ...data.meta,
                    createdBy,
                    createdDate,
                    updatedBy: displayName,
                    updatedDate: currentDate
                }
            };
        });
    }

    private assignDocumentId<T>(dataList: HasMetaData<T>[]): HasMetaData<T>[] {
        return dataList.map(data => {
            data.meta.documentId = data._documentId; 
            delete data._documentId;
            return data;
        });
    }

    private setItemWithExpiration<T>(key: string, value: T[]) {
        this.localStorageService.setItemWithExpiration(key, value, 30, TimeUnit.minute);
    }

}
