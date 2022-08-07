import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import * as moment from 'moment';
import { TimeUnit } from "../../shared/model/time-unit";
import { LocalStorageItem, LocalStorageItemType } from "../../shared/model/local-storage";
import { isArray, isNotNullOrUndefined } from "src/app/common/utils/common-util";
import { HasMetaData } from "src/app/model/meta-data";

@Injectable({ providedIn: 'root' })
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

    setItemWithExpiration<T>(key: string, value: LocalStorageItemType<T>, duration = 7, unitOfTime = TimeUnit.day): void {
        const localStorageItem: LocalStorageItem<T> = { value, expireDate: moment().add(duration, unitOfTime).toDate() };
        this.setItemToLocalStorage(key, JSON.stringify(localStorageItem));
    }

    setLocalStorageItem<T>(key: string, value: LocalStorageItem<T>): void {
        this.setItemToLocalStorage(key, JSON.stringify(value))
    }

    setItem<T>(key: string, value: LocalStorageItemType<T>): void {
        this.setItemToLocalStorage(key, JSON.stringify(value))
    }

    addItem(key: string, value: any): void {
        if (isNotNullOrUndefined(value) && !isArray(value)) value = [value];
        const item = this.getItem<any>(key);
        item.value = item.value ? [...item.value, ...value] : [value];
        this.setItem(key, item);
    }

    updateItem(key: string, value: any): void {
        if (isNotNullOrUndefined(value) && !isArray(value)) value = [value];
        const item = this.getItem<any>(key);
        item.value = item.value 
            ? item.value.map((i: any) => {
                const updateValue = value.find((v: any) => v.meta.documentId === i.meta.documentId);
                return updateValue ? updateValue : i;
            })
            : value;
        this.setItem(key, item);
    }

    deleteItem(key: string, documentId: string): void {
        const item = this.getItem<HasMetaData<any>>(key);
        item.value = item.value.filter((val: any) => val.meta.documentId !== documentId);
        this.setItem(key, item)
    }

    clear(key: string): void {
        localStorage.removeItem(key);
    }

    private setItemToLocalStorage(key: string, value: string): void {
        localStorage.setItem(key, value);
    }

}
