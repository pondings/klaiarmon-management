import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from "@angular/core";
import { Observable } from "rxjs";
import { CalendarView } from 'angular-calendar';
import { CalendarDayEvent, CalendarEventWithMeta } from "../../model/calendar";
import { faArrowsRotate, faChevronLeft, faChevronRight, faFilter, faPlus } from "@fortawesome/free-solid-svg-icons";
import { TimeUnit } from "src/app/shared/model/time-unit";
import { UntilDestroy } from '@ngneat/until-destroy';
import { CalendarService } from "../../services/calendar.service";
import { addDate, getDate } from "src/app/common/utils/date.util";

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

    faChevronLeft = faChevronLeft;
    faChevronRight = faChevronRight;
    faPlus = faPlus;
    faArrowsRotate = faArrowsRotate;
    faFilter = faFilter;

    calendarEvent$!: Observable<CalendarEventWithMeta[]>;
    dayEvents$!: Observable<CalendarEventWithMeta[]>;

    constructor(private calendarService: CalendarService) {}

    ngOnInit(): void {
        this.calendarEvent$ = this.calendarService.getCalendarEvents();
        this.dayEvents$ = this.calendarService.getDayEvents();
    }

    onSwipe(event: any): void {
        const next = Math.abs(event.deltaX) > 40 ? (event.deltaX > 0 ? -1 : 1) : 0;
        this.viewDate = addDate(this.viewDate, next, TimeUnit.month);
    }

    showEvent(events: CalendarDayEvent): void {
        this.viewDate = events.day.date;
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

}
