import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { AngularFireStorage } from "@angular/fire/compat/storage";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { UntilDestroy } from "@ngneat/until-destroy";
import { finalize, take } from "rxjs";
import { SpinnerService } from "../spinner/spinner.service";
import { ToastService } from "../toast/toast.service";
import { EditProfileComponent } from "./edit-profile.component";

@Injectable()
@UntilDestroy({ checkProperties: true })
export class EditProfileService {

    constructor(private modalService: NgbModal,
        private angularFireAuth: AngularFireAuth,
        private angularFireStorage: AngularFireStorage,
        private spinnerService: SpinnerService,
        private toastService: ToastService) {}

    async editProfile(): Promise<void> {
        const userData = await this.angularFireAuth.currentUser;

        const modalRef = this.modalService.open(EditProfileComponent, { centered: true });
        modalRef.componentInstance.userData = { displayName: userData?.displayName, photoUrl: userData?.photoURL };

        await modalRef.result.then((userInfo: firebase.default.UserInfo) => {
            this.spinnerService.show();
            userData?.updateProfile({ ...userInfo });
            this.spinnerService.hide();
            this.toastService.showSuccess('Update user data successfully');
        }, err => {});
    }

    async uploadProfilePhoto(data: Blob): Promise<string> {
        const userInfo = await this.angularFireAuth.currentUser;

        this.spinnerService.show();
        const ref = this.angularFireStorage.ref(`profile-photo/${userInfo?.uid}/`);
        const task = ref.put(data);
        return new Promise((resolve) => {
            task.snapshotChanges().pipe(finalize(() => {
                ref.getDownloadURL().pipe(take(1)).subscribe(url => resolve(url));
            }))
            .subscribe();
        });
    }

}