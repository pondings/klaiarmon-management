import { AfterViewInit, ChangeDetectionStrategy, Component, Input, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormControl, FormControlStatus, FormGroup, Validators } from "@angular/forms";
import { NgbActiveModal, NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import { BehaviorSubject, debounceTime, distinctUntilChanged, filter, map, Observable, OperatorFunction, skip, startWith, Subject, switchMap, tap } from "rxjs";
import { AddCalendarEventForm, CalendarEventWithMeta, Place } from "../../models/calendar";
import { Action } from "src/app/common/enum/action";
import { getDateStructFromDate } from "src/app/common/utils/date-struct.util";
import { getDateFromDateStruct } from "src/app/common/utils/date.util";
import { UntilDestroy } from "@ngneat/until-destroy";
import { Nullable } from "src/app/common/types/common.type";
import { GoogleMap } from "@angular/google-maps";
import { Geolocation } from '@capacitor/geolocation';
import { Capacitor } from "@capacitor/core";

@UntilDestroy({ checkProperties: true })
@Component({
    selector: 'app-calendar-event-modal',
    templateUrl: './calendar-event-modal.component.html',
    styleUrls: ['./calendar-event-modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class CalendarEventModalComponent implements OnInit, AfterViewInit {

    @ViewChild(GoogleMap)
    googleMap!: GoogleMap;

    @Input()
    event!: CalendarEventWithMeta;

    @Input()
    action!: Action;

    readonly googleMapOptions: google.maps.MapOptions = {
        gestureHandling: 'cooperative',
        disableDefaultUI: true,
        scaleControl: true,
        streetViewControl: true,
        zoomControl: true
    }

    faCalendar = faCalendar;

    isFormValid$!: Observable<boolean>;
    startValue$!: Observable<Nullable<NgbDateStruct>>
    endValue$!: Observable<Nullable<NgbDateStruct>>
    withEndDate$!: Observable<boolean>;
    placeSearchResult$ = new BehaviorSubject<google.maps.places.PlaceResult[]>([]);
    mapCenter$ = new Subject<google.maps.LatLngLiteral>();

    calendarEventForm: FormGroup<AddCalendarEventForm>;
    withEndDateCtrl = new FormControl();

    constructor(public activeModal: NgbActiveModal,
        private fb: FormBuilder) {
        this.calendarEventForm = this.createCalendarEventForm();
    }

    async ngOnInit(): Promise<void> {
        this.patchFormValue();
        this.initSubscribe();

        setTimeout(async () => await this.setGoogleMapsForm(), 100);
    }

    ngAfterViewInit(): void {
    }

    submit(): void {
        const formValue = this.calendarEventForm.getRawValue();
        const { name: placeName, place_id: placeId, geometry } = formValue.location || {};
        const place = placeId ? { placeName, placeId, placeLatLng: geometry?.location?.toJSON() } : undefined;

        this.activeModal.close({
            title: formValue.title,
            start: getDateFromDateStruct(formValue.start!),
            end: getDateFromDateStruct(formValue.end!),
            meta: {
                ...this.event.meta,
                description: formValue.description,
                place
            }
        });
    }

    searchPlaceFormatter(result: google.maps.places.PlaceResult): string {
        return result.name!;
    }

    searchPlace: OperatorFunction<string, readonly google.maps.places.PlaceResult[]> = (term$: Observable<string>) => term$.pipe(
        debounceTime(500),
        distinctUntilChanged(),
        filter(term => !!term.trim()),
        switchMap(term => {
            this.findGooglePlace(term);
            return this.placeSearchResult$.pipe(map(places => places.slice(0, 5)));
        })
    );

    private findGooglePlace(query?: string) {
        new google.maps.places.PlacesService(document.createElement('div')).textSearch({ query: query || '' },
            (result) => this.placeSearchResult$.next(result!));
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

    get locationCtrl(): FormControl<Nullable<google.maps.places.PlaceResult>> {
        return this.calendarEventForm.controls.location;
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
        this.locationCtrl.valueChanges.pipe(filter(val => typeof val !== 'string')).subscribe(result =>
            this.setGoogleMapsLocation(result?.geometry?.location?.toJSON()!));
    }

    private isValid(status: FormControlStatus): boolean {
        return status === 'VALID';
    }

    private patchFormValue(): void {
        const { title, start, end } = this.event;

        if (end) this.withEndDateCtrl.setValue(true);
        this.calendarEventForm.patchValue({
            title,
            start: getDateStructFromDate(start),
            end: getDateStructFromDate(end),
            description: this.event.meta?.description
        });
    }

    private async setGoogleMapsForm(): Promise<void> {
        const { placeName, placeLatLng, placeId } = this.event.meta?.place! || {};
        if (!placeName || !placeLatLng) {
            await this.setToCurrentPosition();
            return;
        };

        const location = { name: placeName, place_id: placeId, geometry: { location: new google.maps.LatLng(placeLatLng!) } }
        this.locationCtrl.setValue(location);
        this.setGoogleMapsLocation(location.geometry.location.toJSON());
    }

    private setGoogleMapsLocation(latlng: google.maps.LatLngLiteral): void {
        this.mapCenter$.next(latlng);
        new google.maps.Marker({ position: latlng, map: this.googleMap.googleMap, animation: google.maps.Animation.DROP })
    }

    private async setToCurrentPosition(): Promise<void> {
        if (Capacitor.isNativePlatform()) {
            const codinates = await Geolocation.getCurrentPosition();
            this.setGoogleMapsLocation({ lat: codinates.coords.latitude, lng: codinates.coords.longitude });
        } else {
            navigator.geolocation.getCurrentPosition((position) => {
                this.setGoogleMapsLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
            });
        }
    }

    private createCalendarEventForm(): FormGroup<AddCalendarEventForm> {
        return this.fb.group<AddCalendarEventForm>({
            title: this.fb.control({ value: null, disabled: false }, [Validators.required]),
            start: this.fb.control({ value: null, disabled: false }),
            end: this.fb.control({ value: null, disabled: false }),
            description: this.fb.control({ value: null, disabled: false }),
            location: this.fb.control({ value: null, disabled: false })
        });
    }

}
