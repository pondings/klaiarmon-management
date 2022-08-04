import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from "@angular/core";
import * as moment from 'moment';
import { map, Observable } from "rxjs";
import { FirestoreService } from "src/app/shared/services/firestore.service";
import { CalendarEvent, CalendarView } from 'angular-calendar';
import { CalendarEventDto } from "../../model/calendar-event";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { TimeUnit } from "src/app/shared/model/time-unit";

@Component({
    selector: 'app-calendar',
    templateUrl: './calendar.component.html',
    styleUrls: ['./calendar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class CalendarComponent implements OnInit { 

    view = CalendarView.Month;
    viewDate = moment().toDate();

    faChevronLeft = faChevronLeft;
    faChevronRight = faChevronRight;

    calendarEvent$!: Observable<CalendarEvent[]>;

    constructor(private firestoreService: FirestoreService) {}

    ngOnInit(): void {
        this.calendarEvent$ = this.firestoreService.getCollection<CalendarEventDto>('calendar/event/public-holiday')
            .pipe(map(dtoList => this.mapDtoToCalendarEvent(dtoList)));
    }

    onSwipe(event: any): void {
        const next = Math.abs(event.deltaX) > 40 ? (event.deltaX > 0 ? -1 : 1) : 0;
        this.viewDate = moment(this.viewDate).add(next, TimeUnit.month).toDate();
    }

    private mapDtoToCalendarEvent(dtoList: CalendarEventDto[]): CalendarEvent[] {
        return dtoList.map(dto => ({ ...dto, start: this.mapStringToDate(dto.start) }));
    }

    private mapStringToDate(dateString: string): Date {
        return moment(dateString).toDate();
    }

}
