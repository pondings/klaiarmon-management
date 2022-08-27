import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from "@angular/core";
import { FormControl } from "@angular/forms";
import { faMagnifyingGlass, faXmark } from "@fortawesome/free-solid-svg-icons";
import { Observable } from "rxjs";
import { NullableDateStruct } from "src/app/common/utils/date-struct.util";

@Component({
    selector: 'app-memo-search-form',
    templateUrl: './memo-search-form.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class MemoSearchFormComponent implements OnInit {

    startDateValue$!: Observable<NullableDateStruct>;
    endDateValue$!: Observable<NullableDateStruct>;

    createdByCtrl = new FormControl();
    startDateCtrl = new FormControl();
    endDateCtrl = new FormControl();

    faMagnifyingGlass = faMagnifyingGlass;
    faXmark = faXmark;

    ngOnInit(): void {
        this.startDateValue$ = this.startDateCtrl.valueChanges;
        this.endDateValue$ = this.endDateCtrl.valueChanges;
    }

}
