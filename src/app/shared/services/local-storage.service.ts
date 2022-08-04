import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import * as moment from 'moment';
import { TimeUnit } from "../model/time-unit";
import { LocalStorageItem, LocalStorageItemType } from "../model/local-storage";

@Injectable()
export class LocalStorageService {

    getItemAsObservable<T>(key: string): Observable<LocalStorageItem<T>> {
        return new BehaviorSubject<LocalStorageItem<T>>(this.getItem(key))
            .asObservable();
    }

    getItem<T>(key: string): LocalStorageItem<T> {
        const target: LocalStorageItem<T> = JSON.parse(localStorage.getItem(key) as string) || {};
        target.isExpired = target.expireDate ? moment().diff(target.expireDate) > 0 : true;
        return target;
    }

    setItemWithEsetItemxpiration<T>(key: string, value: LocalStorageItemType<T>, duration = 7, unitOfTime = TimeUnit.day): void {
        const localStorageItem: LocalStorageItem<T> = { value, expireDate: moment().add(duration, unitOfTime).toDate() };
        this.setItemToLocalStorage(key, JSON.stringify(localStorageItem));
    }

    setLocalStorageItem<T>(key: string, value: LocalStorageItem<T>): void {
        this.setItemToLocalStorage(key, JSON.stringify(value))
    }

    setItem<T>(key: string, value: LocalStorageItemType<T>): void {
        this.setItemToLocalStorage(key, JSON.stringify(value))
    }

    private setItemToLocalStorage(key: string, value: string): void {
        localStorage.setItem(key, value);
    }

}
