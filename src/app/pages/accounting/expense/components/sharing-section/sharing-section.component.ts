import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from "@angular/core";
import { FormArray, FormBuilder, FormGroup } from "@angular/forms";
import { faCircleMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { NullableNumber, NullableUserInfo } from "src/app/common/types/common.type";
import { SharingForm } from "../../model/expense.model";

@Component({
    selector: 'app-sharing-section',
    templateUrl: './sharing-section.component.html',
    styleUrls: ['sharing-section.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class SharingSectionComponent {

    @Input()
    sharingFormArr!: FormArray<FormGroup<SharingForm>>;

    faPlus = faPlus;
    faCircleMinus = faCircleMinus;

    constructor(private fb: FormBuilder) { }

    addSharingForm(): void {
        const sharingForm = this.buildSharingForm();
        this.sharingFormArr.push(sharingForm);
    }

    removeSharingForm(formIdx: number): void {
        this.sharingFormArr.controls.splice(formIdx, 1);
    }

    private buildSharingForm(): FormGroup<SharingForm> {
        return this.fb.group({
            user: this.fb.control<NullableUserInfo>({ value: null, disabled: false }),
            amount: this.fb.control<NullableNumber>({ value: null, disabled: false })
        });
    }

}
