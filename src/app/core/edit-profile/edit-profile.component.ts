import { ChangeDetectionStrategy, Component, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { EditProfileForm } from "./edit-profile.model";
import { EditProfileService } from "./edit-profile.service";

@Component({
    selector: 'app-edit-profile',
    templateUrl: 'edit-profile.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class EditProfileComponent {

    editProfileForm: FormGroup<EditProfileForm>;

    constructor(private editProfileService: EditProfileService,
        private modalService: NgbActiveModal,
        private fb: FormBuilder) {
        this.editProfileForm = this.buildEditProfileForm();
    }

    update(): void {
        this.modalService.close();
    }

    dismiss(): void {
        this.modalService.dismiss();
    }

    private buildEditProfileForm(): FormGroup<EditProfileForm> {
        return this.fb.group({
            displayName: this.fb.control({ value: '', disabled: false }),
            photoUrl: this.fb.control({ value: '', disabled: false })
        });
    }

}
