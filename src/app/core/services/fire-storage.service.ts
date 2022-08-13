import { Injectable } from "@angular/core";
import { AngularFireStorage } from "@angular/fire/compat/storage";
import { finalize } from "rxjs";
import { takeOnce } from "src/app/common/utils/rxjs-util";
import { SpinnerService } from "../spinner/spinner.service";

@Injectable({ providedIn: 'root' })
export class FireStorageService {

    constructor(private angularFireStorage: AngularFireStorage,
        private spinnerService: SpinnerService) { }

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

}
