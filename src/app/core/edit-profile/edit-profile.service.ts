import { Injectable } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { UntilDestroy } from "@ngneat/until-destroy";
import * as moment from "moment";
import { FireAuthService } from "../services/fire-auth.service";
import { SpinnerService } from "../spinner/spinner.service";
import { ToastService } from "../toast/toast.service";
import { EditProfileComponent } from "./edit-profile.component";
import { EditProfile } from "./edit-profile.model";
import { UserInfo } from "../models/user.model";
import { FireStorageService } from "../services/fire-storage.service";

@Injectable()
@UntilDestroy({ checkProperties: true })
export class EditProfileService {

    constructor(private modalService: NgbModal,
        private fireAuthService: FireAuthService,
        private fireStorageService: FireStorageService,
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
            const editData: Partial<UserInfo> = { displayName: userInfo.displayName!, photoURL };

            this.fireAuthService.updateUserInfo(editData);
            this.fireAuthService.triggerSubscribedUserInfo(editData);
            this.spinnerService.hide();
            this.toastService.showSuccess('Update user data successfully');
        }, err => {});
    }

    async uploadProfilePhoto(data: Blob, fileName: string): Promise<string> {
        const userInfo = await this.fireAuthService.getCurrentUser();
        return await this.fireStorageService.uploadPhoto(`profile-photo/${userInfo?.uid}/${fileName}-${moment().format('DD-MM-YYYY')}`, data);
    }

}
