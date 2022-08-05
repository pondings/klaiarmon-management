import { Injectable } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { forkJoin, map, Observable } from "rxjs";
import { FirestoreService } from "src/app/core/services/firestore.service";
import { CalendarEventDto } from "../model/calendar";
import { CalendarEvent } from "angular-calendar";
import { MetaData } from "src/app/model/meta-data";
import { AddEventModalComponent } from "../components/calendar-event-modal/calendar-event-modal.component";
import { Action } from "src/app/common/enum/action";
import { getDateStartOfDay, parseDate } from "src/app/common/utils/date.util";

@Injectable()
export class CalendarService {

    private static readonly PUBLIC_HOLIDAY_COLLECTION = 'calendar/event/public-holiday';
    private static readonly CUSTOM_EVENT_COLLECTION = 'calendar/event/custom-event';

    constructor(private firestoreService: FirestoreService,
        private ngbModalService: NgbModal) { }

    getCalendarEvents(): Observable<CalendarEvent<MetaData>[]> {
        const holidayEvents = this.firestoreService.getCollection<CalendarEventDto>(CalendarService.PUBLIC_HOLIDAY_COLLECTION);
        const customEvents = this.firestoreService.getCollection<CalendarEventDto>(CalendarService.CUSTOM_EVENT_COLLECTION);

        return forkJoin([holidayEvents, customEvents]).pipe(map(([he, ce]) => [...he, ...ce]),
            map(events => this.mapCalendarDtoToEvents(events)));
    }

    updateEvent(event: CalendarEvent<MetaData>): void {
        
    }

    addEvent(): void {
        const modalRef = this.ngbModalService.open(AddEventModalComponent, { centered: true });
        modalRef.componentInstance.event = { start: getDateStartOfDay() };
        modalRef.componentInstance.action = Action.CREATE;
        modalRef.result.then(async (calendarEvent: CalendarEvent<MetaData>) => {
            const dto = this.mapCalendarEventToDto(calendarEvent);
            await this.firestoreService.addToCollection(CalendarService.CUSTOM_EVENT_COLLECTION, dto);
        }, () => { });
    }

    private mapCalendarEventToDto(calendarEvent: CalendarEvent<MetaData>): CalendarEventDto {
        const { title, start, end, meta } = calendarEvent;
        return { title, start: start.toISOString(), end: end?.toISOString()!, meta: meta || {}, allDay: true };
    }

    private mapCalendarDtoToEvents(events: CalendarEventDto[]): CalendarEvent<MetaData>[] {
        return events.map(event => ({
            ...event,
            start: parseDate(event.start)!,
            end: event.end ? parseDate(event.end)! : null!
        }));
    }

}
