import { Injectable } from "@angular/core";
import { AngularFireStorage } from "@angular/fire/compat/storage";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { UntilDestroy } from "@ngneat/until-destroy";
import * as moment from "moment";
import { finalize, take } from "rxjs";
import { FireAuthService } from "../services/fire-auth.service";
import { SpinnerService } from "../spinner/spinner.service";
import { ToastService } from "../toast/toast.service";
import { EditProfileComponent } from "./edit-profile.component";
import { EditProfile } from "./edit-profile.model";
import { compressAccurately } from 'image-conversion';

@Injectable()
@UntilDestroy({ checkProperties: true })
export class EditProfileService {

    constructor(private modalService: NgbModal,
        private fireAuthService: FireAuthService,
        private angularFireStorage: AngularFireStorage,
        private spinnerService: SpinnerService,
        private toastService: ToastService) {}

    async editProfile(): Promise<void> {
        const userData = await this.fireAuthService.getCurrentUser();

        const modalRef = this.modalService.open(EditProfileComponent, { centered: true });
        modalRef.componentInstance.userData = { displayName: userData?.displayName, photoURL: userData?.photoURL };

        await modalRef.result.then(async (userInfo: EditProfile) => {
            this.spinnerService.show();

            const photoURL = userInfo.profilePhoto 
                ? await this.uploadProfilePhoto(userInfo.profilePhoto, userInfo.profilePhoto.name) 
                : userData?.photoURL;
            const editData: Partial<firebase.default.UserInfo> = { displayName: userInfo.displayName!, photoURL };

            this.fireAuthService.updateUserInfo(editData);
            this.fireAuthService.triggerSubscribedUserInfo(editData);
            this.spinnerService.hide();
            this.toastService.showSuccess('Update user data successfully');
        }, err => {});
    }

    async uploadProfilePhoto(data: Blob, fileName: string): Promise<string> {
        const userInfo = await this.fireAuthService.getCurrentUser();

        data = await compressAccurately(data, 200);
        const ref = this.angularFireStorage.ref(`profile-photo/${userInfo?.uid}/${fileName}-${moment().format('DD-MM-YYYY')}`);
        const task = ref.put(data, { cacheControl: 'public, max-age=86400' });
        return new Promise((resolve) => {
            task.snapshotChanges().pipe(finalize(() => {
                ref.getDownloadURL().pipe(take(1)).subscribe(url => resolve(url));
            }))
            .subscribe();
        });
    }

}
