import { ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { faArrowRotateLeft, faArrowUpFromBracket } from "@fortawesome/free-solid-svg-icons";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { UntilDestroy } from "@ngneat/until-destroy";
import { BehaviorSubject, Subject } from "rxjs";
import { Nullable } from "src/app/common/types/common.type";
import { inputFileToBlob } from "src/app/common/utils/file-util";
import { EditProfile, EditProfileForm } from "./edit-profile.model";
import { EditProfileService } from "./edit-profile.service";

@UntilDestroy({ checkProperties: true })
@Component({
    selector: 'app-edit-profile',
    templateUrl: 'edit-profile.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class EditProfileComponent implements OnInit {

    @Input()
    userData!: firebase.default.UserInfo;

    faArrowUpFromBracket = faArrowUpFromBracket;
    faArrowRotateLeft = faArrowRotateLeft;


    profilePhoto$ = new BehaviorSubject<Nullable<string | SafeUrl>>(null);

    editProfileForm: FormGroup<EditProfileForm>;

    constructor(private editProfileService: EditProfileService,
        private modalService: NgbActiveModal,
        private fb: FormBuilder,
        private sanitizer: DomSanitizer) {
        this.editProfileForm = this.buildEditProfileForm();
    }

    ngOnInit(): void {
        this.profilePhoto$.next(this.userData.photoURL);
        this.displayNameCtrl.setValue(this.userData.displayName);
    }

    submit(): void {
        const formValue = this.editProfileForm.getRawValue();
        this.modalService.close(formValue);
    }

    resetPhoto(): void {
        this.profilePhoto$.next(this.userData.photoURL);
        this.profilePhotoCtrl.reset();
    }

    dismiss(): void {
        this.modalService.dismiss();
    }

    async changeProfilePhoto(event: Event): Promise<void> {
        const files = (<HTMLInputElement> event.target).files;
        const file = files?.item(0)!;
        const url = await inputFileToBlob(file);
        this.profilePhoto$.next(this.sanitizer.bypassSecurityTrustUrl(url));
        this.profilePhotoCtrl.setValue(file);
    }

    get isFormValid(): boolean {
        return this.editProfileForm.valid;
    }

    get displayNameCtrl(): FormControl<Nullable<string>> {
        return this.editProfileForm.controls.displayName;
    }

    get profilePhotoCtrl(): FormControl<Nullable<File>> {
        return this.editProfileForm.controls.profilePhoto;
    }

    private buildEditProfileForm(): FormGroup<EditProfileForm> {
        return this.fb.group({
            displayName: this.fb.control<Nullable<string>>({ value: null, disabled: false }, [Validators.required]),
            profilePhoto: this.fb.control<Nullable<File>>({ value: null, disabled: false })
        });
    }

}
