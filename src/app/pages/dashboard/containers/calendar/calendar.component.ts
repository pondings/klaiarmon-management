import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from "@angular/core";
import * as moment from 'moment';
import { map, Observable } from "rxjs";
import { FirestoreService } from "src/app/shared/services/firestore.service";
import { CalendarEvent } from 'angular-calendar';
import { CalendarEventDto } from "../../model/calendar-event";

@Component({
    selector: 'app-calendar',
    templateUrl: './calendar.component.html',
    styleUrls: ['./calendar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class CalendarComponent implements OnInit { 

    viewDate = moment().toDate();

    calendarEvent$!: Observable<CalendarEvent[]>;

    constructor(private firestoreService: FirestoreService) {}

    ngOnInit(): void {
        this.calendarEvent$ = this.firestoreService.getCollection<CalendarEventDto>('calendar/event/public-holiday')
            .pipe(map(dtoList => this.mapDtoToCalendarEvent(dtoList)));
    }

    private mapDtoToCalendarEvent(dtoList: CalendarEventDto[]): CalendarEvent[] {
        return dtoList.map(dto => ({ ...dto, start: this.mapStringToDate(dto.start) }));
    }

    private mapStringToDate(dateString: string): Date {
        return moment(dateString).toDate();
    }

}
