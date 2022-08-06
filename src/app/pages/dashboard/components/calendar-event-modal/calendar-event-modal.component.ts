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
    selector: 'app-add-event-modal',
    templateUrl: './calendar-event-modal.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class AddEventModalComponent implements OnInit {

    @Input()
    event!: CalendarEventWithMeta;

    @Input()
    action!: Action;

    faCalendar = faCalendar;

    isFormValid$!: Observable<boolean>;
    startValue$!: Observable<Nullable<NgbDateStruct>>
    endValue$!: Observable<Nullable<NgbDateStruct>>
    hasEndDate$!: Observable<boolean>

    calendarEventForm: FormGroup<AddCalendarEventForm>;
    hasEndDateCtrl = new FormControl();

    constructor(public activeModal: NgbActiveModal,
        private fb: FormBuilder) {
        this.calendarEventForm = this.createCalendarEventForm();
    }

    ngOnInit(): void {
        this.patchFormValue();
        this.initSubscribe();
    }

    submit(): void {
        const { start, end, ...formValue } = this.calendarEventForm.getRawValue();
        this.activeModal.close({
            ...formValue,
            start: addDate(start!, -1, TimeUnit.month),
            end: end ? addDate(end!, -1, TimeUnit.month) : null,
            meta: this.event.meta
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
        this.hasEndDateCtrl.valueChanges.subscribe(checked => !checked && this.endCtrl.reset());
        this.isFormValid$ = this.calendarEventForm.statusChanges.pipe(map(this.isValid));
        this.startValue$ = this.startCtrl.valueChanges.pipe(startWith(this.startCtrl.value));
        this.endValue$ = this.endCtrl.valueChanges.pipe(startWith(this.endCtrl.value));
        this.hasEndDate$ = this.hasEndDateCtrl.valueChanges.pipe(startWith(this.hasEndDateCtrl.value));
    }

    private isValid(status: FormControlStatus): boolean {
        return status === 'VALID';
    }

    private patchFormValue(): void {
        const { title, start, end } = this.event;
        this.calendarEventForm.patchValue({ title, start: getDateStructFromDate(start), end: getDateStructFromDate(end) });
    }

    private createCalendarEventForm(): FormGroup<AddCalendarEventForm> {
        return this.fb.group<AddCalendarEventForm>({
            title: this.fb.control({ value: null, disabled: false }, [Validators.required]),
            start: this.fb.control({ value: null, disabled: false }),
            end: this.fb.control({ value: null, disabled: false })
        });
    }

}
