import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { BehaviorSubject, finalize, Observable, take, tap } from "rxjs";
import { SpinnerService } from "src/app/core/spinner/spinner.service";
import { TimeUnit } from "../model/time-unit";
import { LocalStorageService } from "./local-storage.service";

@Injectable()
export class FirestoreService {

    constructor(private angularFirestore: AngularFirestore,
        private spinnerService: SpinnerService,
        private localStorageService: LocalStorageService) {}

    getCollection<T>(path: string): Observable<T[]> {
        this.spinnerService.show();

        const localStorageItem = this.localStorageService.getItem<T[]>(path);
        const observable: Observable<T[]> = localStorageItem.isExpired
            ? this.angularFirestore.collection<T>(path).valueChanges().pipe(tap(val => this.setItemWithEsetItemxpiration(path, val)))
            : new BehaviorSubject<T[]>(localStorageItem.value as T[]).asObservable();

        return observable.pipe(take(1), finalize(() => this.spinnerService.hide()));
    }

    addToCollection<T>(path: string, dataList: T[]): void {
        this.spinnerService.show();

        const batch = this.angularFirestore.firestore.batch();
        const collection = this.angularFirestore.firestore.collection(path);
        dataList.forEach(data => batch.set(collection.doc(), data));

        batch.commit();

        const localStorageItem = this.localStorageService.getItem<T[]>(path);
        localStorageItem.value = localStorageItem.value
            ? [...localStorageItem.value, ...dataList]
            : dataList;
        this.localStorageService.setItem(path, localStorageItem);
    }

    private setItemWithEsetItemxpiration<T>(key: string, value: T[]) {
        this.localStorageService.setItemWithEsetItemxpiration(key, value, 30, TimeUnit.minute);
    }

}
