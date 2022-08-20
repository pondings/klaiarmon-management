import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { faMagnifyingGlass, faXmark } from "@fortawesome/free-solid-svg-icons";
import { Observable } from "rxjs";
import { NullableDateStructFormControl, NullableString, NullableUserInfo, NullableUserInfoFormControl } from "src/app/common/types/common.type";
import { getDateStruct, NullableDateStruct } from "src/app/common/utils/date-struct.util";
import { getDateFromDateStruct } from "src/app/common/utils/date.util";
import { DocumentSearch, DocumentSearchForm } from "../../models/document.model";

@Component({
    selector: 'app-document-search-form',
    templateUrl: './document-search-form.component.html',
    styles: [`.btn-cmd button { width: 30%; }`],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class DocumentSearchFormComponent implements OnInit {

    @Output()
    onSearch = new EventEmitter<DocumentSearch>();

    @Output()
    onClear = new EventEmitter<void>();

    endDateValue$!: Observable<NullableDateStruct>;
    startDateValue$!: Observable<NullableDateStruct>;

    documentForm: FormGroup<DocumentSearchForm>;

    faMagnifyingGlass = faMagnifyingGlass;
    faXmark = faXmark;

    constructor(private fb: FormBuilder) {
        this.documentForm = this.buildFormBuilder();
    }

    ngOnInit(): void {
        this.startDateValue$ = this.startDateCtrl.valueChanges;
        this.endDateValue$ = this.endDateCtrl.valueChanges;
    }

    search(): void {
        const formValue = this.documentForm.getRawValue();
        this.onSearch.emit({
            name: formValue.name!,
            uploadBy: formValue.uploadBy?.uid!,
            startDate: getDateFromDateStruct(formValue.startDate!)!,
            endDate: getDateFromDateStruct(formValue.endDate!)!
        });
    }

    clear(): void {
        this.onClear.emit();
    }

    get startDateCtrl(): NullableDateStructFormControl {
        return this.documentForm.controls.startDate;
    }

    get endDateCtrl(): NullableDateStructFormControl {
        return this.documentForm.controls.endDate;
    }

    get uploadByCtrl(): NullableUserInfoFormControl {
        return this.documentForm.controls.uploadBy;
    }

    private buildFormBuilder(): FormGroup<DocumentSearchForm> {
        return this.fb.group({
            name: this.fb.control<NullableString>({ value: null, disabled: false }),
            uploadBy: this.fb.control<NullableUserInfo>({ value: null, disabled: false }),
            startDate: this.fb.control<NullableDateStruct>({ value: getDateStruct(), disabled: false }),
            endDate: this.fb.control<NullableDateStruct>({ value: getDateStruct(), disabled: false })
        });
    }
    
}
