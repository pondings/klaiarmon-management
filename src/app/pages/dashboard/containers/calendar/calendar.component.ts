import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from "@angular/core";
import { Observable } from "rxjs";
import { CalendarEvent, CalendarView } from 'angular-calendar';
import { CalendarDayEvent } from "../../model/calendar";
import { faChevronLeft, faChevronRight, faPlus } from "@fortawesome/free-solid-svg-icons";
import { TimeUnit } from "src/app/shared/model/time-unit";
import { UntilDestroy } from '@ngneat/until-destroy';
import { MetaData } from "src/app/model/meta-data";
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

    calendarEvent$!: Observable<CalendarEvent<MetaData>[]>;

    constructor(private calendarService: CalendarService) { }

    ngOnInit(): void {
        this.calendarEvent$ = this.calendarService.getCalendarEvents();
    }

    onSwipe(event: any): void {
        const next = Math.abs(event.deltaX) > 40 ? (event.deltaX > 0 ? -1 : 1) : 0;
        this.viewDate = addDate(this.viewDate, next, TimeUnit.month);
    }

    showEvent(events: CalendarDayEvent): void {
        console.log('Show events', events);
    }

    updateEvent(event: CalendarEvent): void {
        this.calendarService.updateEvent(event);
    }

    addEvent(): void {
        this.calendarService.addEvent();
    }

}
