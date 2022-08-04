import { ChangeDetectionStrategy, Component, Input, OnInit, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { NgbActiveModal, NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
import * as moment from 'moment';
import { TimeUnit } from "src/app/shared/model/time-unit";
import { CalendarEvent } from "angular-calendar";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import { Observable, startWith } from "rxjs";
import { AddCalendarEventForm } from "../../model/calendar";

@Component({
    selector: 'app-add-event-modal',
    templateUrl: './add-event-modal.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class AddEventModalComponent implements OnInit {

    @Input()
    event!: CalendarEvent;

    faCalendar = faCalendar;

    addEventForm: FormGroup<AddCalendarEventForm>;
    hasEndDateCtrl = new FormControl();

    constructor(public activeModal: NgbActiveModal,
        private fb: FormBuilder) {
        this.addEventForm = this.createAddEventForm();
    }

    ngOnInit(): void {
        this.patchFormValue();
    }

    addEvent(): void {
        const formValue = this.addEventForm.getRawValue();
        this.activeModal.close({
            ...formValue,
            start: this.convertNgbDateStructToDate(formValue.start!),
            end: this.convertNgbDateStructToDate(formValue.end!),
            allDay: true
        });
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
        return this.addEventForm.controls.start!;
    }

    get endCtrl(): FormControl<NgbDateStruct | null> {
        return this.addEventForm.controls.end!;
    }

    private convertDateToNgbDate(date: Date): NgbDateStruct {
        if (!date) return null!;
        const dateMoment = moment(date).toObject();
        return { day: dateMoment.date, month: dateMoment.months + 1, year: dateMoment.years };
    }

    private convertNgbDateStructToDate(ngbDateStruct: NgbDateStruct): Date {
        if (!ngbDateStruct) return null!;
        return moment(ngbDateStruct).toDate();
    }

    private patchFormValue(): void {
        const { start, end } = this.event || {};
        this.addEventForm.patchValue({
            ...this.event,
            start: this.convertDateToNgbDate(start),
            end: this.convertDateToNgbDate(end!)
        });
    }

    private createAddEventForm(): FormGroup<AddCalendarEventForm> {
        return this.fb.group<AddCalendarEventForm>({
            title: this.fb.control({ value: null, disabled: false }, { validators: [Validators.required] }),
            start: this.fb.control({ value: this.convertDateToNgbDate(moment().startOf(TimeUnit.day).toDate()), disabled: false }),
            end: this.fb.control({ value: null, disabled: false })
        });
    }

}
