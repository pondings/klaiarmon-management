import { Injectable } from "@angular/core";
import { AngularFireStorage } from "@angular/fire/compat/storage";
import { compressAccurately } from "image-conversion";
import { catchError, finalize, of, throwError } from "rxjs";
import { takeOnce } from "src/app/common/utils/rxjs-util";
import { SpinnerService } from "../spinner/spinner.service";

@Injectable({ providedIn: 'root' })
export class FireStorageService {

    constructor(private angularFireStorage: AngularFireStorage,
        private spinnerService: SpinnerService) { }

    async deleteFile(path: string): Promise<void> {
        this.spinnerService.show();
        const ref = this.angularFireStorage.ref(path);
        return new Promise((resolve) => 
            ref.delete().pipe(takeOnce(), catchError(err => of(err)))
            .subscribe(_ => resolve()));
    }

    async getDownloadUrl(path: string): Promise<string> {
        this.spinnerService.show();
        const ref = this.angularFireStorage.ref(path);
        return new Promise((resolve, reject) => {
            ref.getDownloadURL().pipe(
                takeOnce(), 
                finalize(() => this.spinnerService.hide()),
                catchError(err => {
                    reject(err.code);
                    return throwError(() => err.code);
                })).subscribe(url => 
                    resolve(url));
        });
    }

    async uploadFile(path: string, data: Blob): Promise<string> {
        this.spinnerService.show();
        const ref = this.angularFireStorage.ref(path);
        const task = ref.put(data, { cacheControl: 'public, max-age=86400' });
        return new Promise((resolve) => {
            task.snapshotChanges().pipe(finalize(() => ref.getDownloadURL().pipe(takeOnce()).subscribe(url => {
                this.spinnerService.hide();
                return resolve(url);
            }))).subscribe();
        });
    }

    async uploadPhoto(path: string, data: Blob): Promise<string> {
        data = await compressAccurately(data, 200);
        return await this.uploadFile(path, data);
    }

}
