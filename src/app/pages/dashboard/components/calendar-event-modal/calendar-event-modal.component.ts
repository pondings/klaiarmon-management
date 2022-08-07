import { ChangeDetectionStrategy, Component, Input, OnInit, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormControl, FormControlStatus, FormGroup, Validators } from "@angular/forms";
import { NgbActiveModal, NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import { map, Observable, startWith, tap } from "rxjs";
import { AddCalendarEventForm, CalendarEventWithMeta } from "../../model/calendar";
import { Action } from "src/app/common/enum/action";
import { getDateStructFromDate } from "src/app/common/utils/date-struct.util";
import { addDate } from "src/app/common/utils/date.util";
import { UntilDestroy } from "@ngneat/until-destroy";
import { TimeUnit } from "src/app/shared/model/time-unit";
import { Nullable } from "src/app/common/types/common.type";

@UntilDestroy({ checkProperties: true })
@Component({
    selector: 'app-calendar-event-modal',
    templateUrl: './calendar-event-modal.component.html',
    styles: ['div.input-checkbox { margin-bottom: 0.75rem !important; }'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class CalendarEventModalComponent implements OnInit {

    @Input()
    event!: CalendarEventWithMeta;

    @Input()
    action!: Action;

    faCalendar = faCalendar;

    isFormValid$!: Observable<boolean>;
    startValue$!: Observable<Nullable<NgbDateStruct>>
    endValue$!: Observable<Nullable<NgbDateStruct>>
    withEndDate$!: Observable<boolean>

    calendarEventForm: FormGroup<AddCalendarEventForm>;
    withEndDateCtrl = new FormControl();

    constructor(public activeModal: NgbActiveModal,
        private fb: FormBuilder) {
        this.calendarEventForm = this.createCalendarEventForm();
    }

    ngOnInit(): void {
        this.patchFormValue();
        this.initSubscribe();
    }

    submit(): void {
        const formValue = this.calendarEventForm.getRawValue();
        this.activeModal.close({
            title: formValue.title,
            start: addDate(formValue.start!, -1, TimeUnit.month),
            end: formValue.end ? addDate(formValue.end!, -1, TimeUnit.month) : null,
            meta: {
                ...this.event.meta,
                description: formValue.description
            }
        });
    }

    get titleCtrl(): FormControl<Nullable<string>> {
        return this.calendarEventForm.controls.title;
    }

    get startCtrl(): FormControl<Nullable<NgbDateStruct>> {
        return this.calendarEventForm.controls.start;
    }

    get endCtrl(): FormControl<Nullable<NgbDateStruct>> {
        return this.calendarEventForm.controls.end;
    }

    get isCreate(): boolean {
        return this.action === Action.CREATE;
    }

    get isUpdate(): boolean {
        return this.action === Action.UPDATE;
    }

    private initSubscribe(): void {
        this.withEndDateCtrl.valueChanges.subscribe(checked => !checked && this.endCtrl.reset());
        this.isFormValid$ = this.calendarEventForm.statusChanges.pipe(map(this.isValid));
        this.startValue$ = this.startCtrl.valueChanges.pipe(startWith(this.startCtrl.value));
        this.endValue$ = this.endCtrl.valueChanges.pipe(startWith(this.endCtrl.value));
        this.withEndDate$ = this.withEndDateCtrl.valueChanges.pipe(startWith(this.withEndDateCtrl.value));
    }

    private isValid(status: FormControlStatus): boolean {
        return status === 'VALID';
    }

    private patchFormValue(): void {
        const { title, start, end } = this.event;
        
        if (end) this.withEndDateCtrl.setValue(true);
        this.calendarEventForm.patchValue({ title, start: getDateStructFromDate(start), end: getDateStructFromDate(end), description: this.event.meta?.description });
    }

    private createCalendarEventForm(): FormGroup<AddCalendarEventForm> {
        return this.fb.group<AddCalendarEventForm>({
            title: this.fb.control({ value: null, disabled: false }, [Validators.required]),
            start: this.fb.control({ value: null, disabled: false }),
            end: this.fb.control({ value: null, disabled: false }),
            description: this.fb.control({ value: null, disabled: false })
        });
    }

}
