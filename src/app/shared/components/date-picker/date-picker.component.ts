import { ChangeDetectionStrategy, Component, Input, OnInit, ViewEncapsulation } from "@angular/core";
import { FormControl } from "@angular/forms";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import { NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
import { Observable } from "rxjs";
import { isFormDisabled } from "src/app/common/utils/form-util";

@Component({
    selector: 'app-date-picker',
    templateUrl: './date-picker.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class DatePickerComponent implements OnInit {

    @Input()
    control!: FormControl;

    @Input()
    label!: string;

    @Input()
    maxDate!: NgbDateStruct;

    @Input()
    minDate!: NgbDateStruct;

    faCalendar = faCalendar;

    isDisabled$!: Observable<boolean>;
    
    ngOnInit(): void {
        this.isDisabled$ = this.control.statusChanges.pipe(isFormDisabled);
    }

}
