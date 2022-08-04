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

    private setItemWithEsetItemxpiration<T>(key: string, value: T[]) {
        this.localStorageService.setItemWithEsetItemxpiration(key, value, 30, TimeUnit.minute);
    }

}
