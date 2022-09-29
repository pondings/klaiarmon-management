import { Injectable } from "@angular/core";
import { QueryFn } from "@angular/fire/compat/firestore";
import { BehaviorSubject, Observable } from "rxjs";
import { getMoment } from "src/app/common/utils/moment.util";
import { DataService } from "src/app/core/services/data-service";
import { CalendarEventDto, CalendarEventWithMeta } from "../../calendar/models/calendar";
import { mapCalendarDtoToEvent } from "../../calendar/utils/calendar.util";

@Injectable()
export class DashboardService {

    private static readonly PUBLIC_HOLIDAY_COLLECTION = 'calendar/event/public-holiday';
    private static readonly CUSTOM_EVENT_COLLECTION = 'calendar/event/custom-event';

    incomingEvents$ = new BehaviorSubject<CalendarEventWithMeta[]>([]);
    incomingHoliday$ = new BehaviorSubject<CalendarEventWithMeta[]>([]);


    constructor(private dataService: DataService) {}

    subscribeIncomingEvent(): Observable<CalendarEventWithMeta[]> {
        return this.incomingEvents$.asObservable();
    }

    subscribeIncomingHoliday(): Observable<CalendarEventWithMeta[]> {
        return this.incomingHoliday$.asObservable();
    }

    async fetchIncomingEvents(): Promise<void> {
        this.incomingEvents$.next(await this.fetchEvent(DashboardService.CUSTOM_EVENT_COLLECTION));
    }

    async fetchIncomingHoliday(): Promise<void> {
        this.incomingHoliday$.next(await this.fetchEvent(DashboardService.PUBLIC_HOLIDAY_COLLECTION));
    }

    async fetchEvent(eventType: string): Promise<CalendarEventWithMeta[]> {
        const criteriaQuery: QueryFn = ref => {
            let query: firebase.default.firestore.CollectionReference | firebase.default.firestore.Query = ref;
            return query.where('start', '>=', getMoment()?.startOf('day').toDate())
                .where('start', '<=', getMoment()?.add(6, 'months').startOf('day').toDate())
                .limit(5)
                .orderBy('start', 'asc');
        };

        const result = await this.dataService.getCollection<CalendarEventDto>(eventType, { query: criteriaQuery, showSpinner: true });
        return result.map(mapCalendarDtoToEvent);
    }

}