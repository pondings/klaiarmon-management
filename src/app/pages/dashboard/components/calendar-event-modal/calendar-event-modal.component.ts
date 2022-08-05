import { ChangeDetectionStrategy, Component, Input, OnInit, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { NgbActiveModal, NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
import { CalendarEvent } from "angular-calendar";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import { map, Observable, startWith } from "rxjs";
import { AddCalendarEventForm } from "../../model/calendar";
import { Action } from "src/app/common/enum/action";
import { getDateStructFromDate } from "src/app/common/utils/date-struct.util";
import { addDate, getDate } from "src/app/common/utils/date.util";
import { UntilDestroy } from "@ngneat/until-destroy";
import { TimeUnit } from "src/app/shared/model/time-unit";

@UntilDestroy({ checkProperties: true })
@Component({
    selector: 'app-add-event-modal',
    templateUrl: './calendar-event-modal.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class AddEventModalComponent implements OnInit {

    @Input()
    event!: CalendarEvent;

    @Input()
    action!: Action;

    faCalendar = faCalendar;

    calendarEventForm: FormGroup<AddCalendarEventForm>;
    hasEndDateCtrl = new FormControl();

    constructor(public activeModal: NgbActiveModal,
        private fb: FormBuilder) {
        this.calendarEventForm = this.createCalendarEventForm();
    }

    ngOnInit(): void {
        this.patchFormValue();
        this.hasEndDateCtrl.valueChanges.subscribe(checked => !checked && this.endCtrl.reset());
    }

    submit(): void {
        const { start, end, ...formValue } = this.calendarEventForm.getRawValue();
        this.activeModal.close({ 
            ...formValue, 
            start: addDate(start!, -1, TimeUnit.month), 
            end: end ? addDate(end!, -1, TimeUnit.month) : null , 
            meta: this.event.meta
        });
    }

    get isFormValid$(): Observable<boolean> {
        return this.calendarEventForm.statusChanges.pipe(map(status => status === 'VALID'));
    }

    get startValue$(): Observable<NgbDateStruct | null> {
        return this.startCtrl.valueChanges.pipe(startWith(this.startCtrl.value));
    }

    get endValue$(): Observable<NgbDateStruct | null> {
        return this.endCtrl.valueChanges.pipe(startWith(this.endCtrl.value));
    }

    get hasEndDate$(): Observable<boolean> {
        return this.hasEndDateCtrl.valueChanges.pipe(startWith(this.hasEndDateCtrl.value));
    }

    get startCtrl(): FormControl<NgbDateStruct | null> {
        return this.calendarEventForm.controls.start!;
    }

    get endCtrl(): FormControl<NgbDateStruct | null> {
        return this.calendarEventForm.controls.end!;
    }

    get isCreate(): boolean {
        return this.action === Action.CREATE;
    }

    get isUpdate(): boolean {
        return this.action === Action.UPDATE;
    }

    private patchFormValue(): void {
        const { title, start, end } = this.event;
        this.calendarEventForm.patchValue({ title, start: getDateStructFromDate(start), end: getDateStructFromDate(end) });
    }

    private createCalendarEventForm(): FormGroup<AddCalendarEventForm> {
        return this.fb.group<AddCalendarEventForm>({
            title: this.fb.control({ value: null, disabled: false }, { validators: [Validators.required] }),
            start: this.fb.control({ value: null, disabled: false }),
            end: this.fb.control({ value: null, disabled: false })
        });
    }

}
