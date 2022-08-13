import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from "@angular/core";
import { FormControl } from "@angular/forms";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import { NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";

@Component({
    selector: 'app-date-picker',
    templateUrl: './date-picker.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class DatePickerComponent {

    @Input()
    control!: FormControl;

    @Input()
    label!: string;

    @Input()
    maxDate!: NgbDateStruct;

    @Input()
    minDate!: NgbDateStruct;

    faCalendar = faCalendar;

}
