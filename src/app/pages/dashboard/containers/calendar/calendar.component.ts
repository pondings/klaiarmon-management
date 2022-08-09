import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from "@angular/core";
import { catchError, map, Observable, of } from "rxjs";
import { CalendarView } from 'angular-calendar';
import { CalendarDayEvent, CalendarEventWithMeta } from "../../model/calendar";
import { faArrowsRotate, faBan, faChevronLeft, faChevronRight, faPlus, faReplyAll } from "@fortawesome/free-solid-svg-icons";
import { TimeUnit } from "src/app/shared/model/time-unit";
import { UntilDestroy } from '@ngneat/until-destroy';
import { CalendarService } from "../../services/calendar.service";
import { addDate, getDate } from "src/app/common/utils/date.util";
import { HttpService } from "src/app/shared/services/http.service";
import { environment } from "src/environments/environment";

@UntilDestroy({ checkProperties: true })
@Component({
    selector: 'app-calendar',
    templateUrl: './calendar.component.html',
    styleUrls: ['./calendar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class CalendarComponent implements OnInit {

    readonly PUBLIC_HOLIDAT = 'calendar/event/public-holiday';

    view = CalendarView.Month;
    viewDate = getDate();
    viewEventDate!: Date | null;

    faChevronLeft = faChevronLeft;
    faChevronRight = faChevronRight;
    faPlus = faPlus;
    faArrowsRotate = faArrowsRotate;
    faReplyAll = faReplyAll;
    faBan = faBan;

    calendarEvent$!: Observable<CalendarEventWithMeta[]>;
    dayEvents$!: Observable<CalendarEventWithMeta[]>;
    viewEventDate$!: Observable<Date>;
    isMapLoaded$!: Observable<boolean>;

    constructor(private calendarService: CalendarService, private httpService: HttpService) { }

    ngOnInit(): void {
        this.calendarEvent$ = this.calendarService.getCalendarEvents();
        this.dayEvents$ = this.calendarService.getDayEvents();
        this.viewEventDate$ = this.dayEvents$.pipe(map(events => (events || [])[0]), map(event => (event || {}).start));
        this.isMapLoaded$ = this.httpService.jsonp(`https://maps.googleapis.com/maps/api/js?key=${environment.google.mapApiKey}&libraries=places`, 'callback')
            .pipe(map(() => true), catchError(() => of(false)));
    }

    onSwipe(event: any): void {
        const next = Math.abs(event.deltaX) > 40 ? (event.deltaX > 0 ? -1 : 1) : 0;
        this.viewDate = addDate(this.viewDate, next, TimeUnit.month);
    }

    showEvent(events: CalendarDayEvent): void {
        this.viewDate = events.day.date;
        this.viewEventDate = events.day.date;
        this.calendarService.showEvents(events.day.events);
    }

    editEvent(event: CalendarEventWithMeta): void {
        this.calendarService.editEvent(event, this.viewDate);
    }

    async addEvent(): Promise<void> {
        this.calendarService.addEvent(this.viewDate);
    }

    async deleteEvent(documentId: string): Promise<void> {
        this.calendarService.deleteEvent(documentId);
    }

    reload(): void {
        this.calendarEvent$ = this.calendarService.reload();
    }

    clearEvents(): void {
        this.calendarService.clearEvents();
    }

}
