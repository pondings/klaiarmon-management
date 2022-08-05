import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { BehaviorSubject, finalize, map, Observable, take, tap } from "rxjs";
import { SpinnerService } from "src/app/core/spinner/spinner.service";
import { HasMetaData, HasRawMetaData, HasRawMetaWithoutId } from "src/app/model/meta-data";
import { TimeUnit } from "../../shared/model/time-unit";
import { LocalStorageService } from "./local-storage.service";
import * as firebase from 'firebase/firestore';

@Injectable({ providedIn: 'root' })
export class FirestoreService {

    static readonly DOCUMENT_ID_KEY = 'meta.documentId';

    constructor(private angularFirestore: AngularFirestore,
        private angularFireAuth: AngularFireAuth,
        private spinnerService: SpinnerService,
        private localStorageService: LocalStorageService) { }

    subscribeCollection<T>(path: string): Observable<HasMetaData<T>[]> {
        this.spinnerService.show();
        return this.angularFirestore.collection<HasRawMetaData<T>>(path).valueChanges()
            .pipe(tap(() => this.spinnerService.hide()), map(data => this.mapMetaData(data)));
    }

    getCollection<T>(path: string): Observable<HasMetaData<T>[]> {
        this.spinnerService.show();

        const localStorageItem = this.localStorageService.getItem<T[]>(path);
        const observable: Observable<HasMetaData<T>[]> = localStorageItem.isExpired
            ? this.angularFirestore.collection<HasRawMetaData<T>>(path).valueChanges({ idField: FirestoreService.DOCUMENT_ID_KEY })
                .pipe(map(dataList => this.mapMetaData(dataList)), tap(val => this.setItemWithExpiration(path, val)))
            : new BehaviorSubject<HasMetaData<T>[]>(localStorageItem.value as HasMetaData<T>[]).asObservable();

        return observable.pipe(take(1), finalize(() => this.spinnerService.hide()));
    }

    async addToCollection<T>(path: string, data: HasMetaData<T>): Promise<void>;
    async addToCollection<T>(path: string, data: HasMetaData<T>[]): Promise<void> {
        if (!(data instanceof Array)) data = [data];
        const dataWithoutId: HasRawMetaWithoutId<T>[] = await this.setMetaData(data);

        this.spinnerService.show();

        const batch = this.angularFirestore.firestore.batch();
        const collection = this.angularFirestore.firestore.collection(path);
        dataWithoutId.map(data => this.cleanData(data)).forEach(data => batch.set(collection.doc(), data));

        await batch.commit();

        const localStorageItem = this.localStorageService.getItem<T[]>(path);
        localStorageItem.value = localStorageItem.value
            ? [...localStorageItem.value, ...data]
            : data;
        this.localStorageService.setItem(path, localStorageItem);
        this.spinnerService.hide();
    }

    private async setMetaData<T>(dataList: HasMetaData<T>[]): Promise<HasRawMetaWithoutId<T>[]> {
        const userInfo = await this.angularFireAuth.currentUser;
        return dataList.map(data => {
            const displayName = userInfo?.displayName!;
            const currentDate = firebase.Timestamp.now();

            const { createdBy = displayName, createdDate = currentDate } = data.meta;
            return <HasRawMetaData<T>> {
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

    private mapMetaData<T>(dataList: HasRawMetaData<T>[]): HasMetaData<T>[] {
        return dataList.map(d => ({
            ...d,
            meta: {
                ...d.meta,
                createdDate: d.meta?.createdDate?.toDate(),
                updatedDate: d.meta?.updatedDate?.toDate()
            }
        }))
    }

    private setItemWithExpiration<T>(key: string, value: T[]) {
        this.localStorageService.setItemWithExpiration(key, value, 30, TimeUnit.minute);
    }

    private cleanData(data: { [key:string]: any }): { [key:string]: any } {
        Object.keys(data).forEach(key => {
            if (typeof data[key] === 'object') {
                data[key] = this.cleanData(data[key]);
            } else if (!data[key]) {
                delete data[key];
            }
        });
        return data;
    }

}
