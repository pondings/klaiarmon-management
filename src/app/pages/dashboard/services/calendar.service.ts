import { Injectable } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { BehaviorSubject, forkJoin, Observable, take, tap } from "rxjs";
import { CalendarEventDto, CalendarEventWithMeta } from "../model/calendar";
import { CalendarEventModalComponent } from "../components/calendar-event-modal/calendar-event-modal.component";
import { Action } from "src/app/common/enum/action";
import { NullableDate } from "src/app/common/utils/date.util";
import { filterEventsDocIdNotEqual, mapCalendarEventToDto, mapDtoListToEvents, mapDtoToEvent, mapToEditable } from "../utils/calendar.util";
import * as moment from "moment";
import { TimeUnit } from "src/app/shared/model/time-unit";
import { DataService } from "src/app/core/services/data-service";
import { mergeForkArrays, takeOnce } from "src/app/common/utils/rxjs-util";
import { SpinnerService } from "src/app/core/spinner/spinner.service";

@Injectable()
export class CalendarService {

    private static readonly PUBLIC_HOLIDAY_COLLECTION = 'calendar/event/public-holiday';
    private static readonly CUSTOM_EVENT_COLLECTION = 'calendar/event/custom-event';

    private calendarEvent$ = new BehaviorSubject<CalendarEventWithMeta[]>([]);
    private dayEvent$ = new BehaviorSubject<CalendarEventWithMeta[]>([]);

    constructor(private dataService: DataService,
        private spinnerService: SpinnerService,
        private ngbModalService: NgbModal) { }

    subscribeCalendarEvents(): Observable<CalendarEventWithMeta[]> {
        return this.calendarEvent$.asObservable();
    }

    subscribeDayEvents(): Observable<CalendarEventWithMeta[]> {
        return this.dayEvent$.asObservable();
    }

    getCalendarEvents(): void {
        this.spinnerService.show();
        const holidayEvents = this.dataService.getCollection<CalendarEventDto>(CalendarService.PUBLIC_HOLIDAY_COLLECTION);
        const customEvents = this.dataService.getCollection<CalendarEventDto>(CalendarService.CUSTOM_EVENT_COLLECTION)
            .pipe(mapToEditable);
        
        forkJoin([holidayEvents, customEvents]).pipe(takeOnce(), mergeForkArrays, mapDtoListToEvents)
            .subscribe(events => {
                this.calendarEvent$.next(events);
                this.spinnerService.hide();
            });
    }

    showEvents(events: CalendarEventWithMeta[]): void {
        this.dayEvent$.next(events);
    }

    async editEvent(event: CalendarEventWithMeta, currentViewDate: NullableDate): Promise<void> {
        const modalRef = this.ngbModalService.open(CalendarEventModalComponent, { centered: true });
        modalRef.componentInstance.event = event;
        modalRef.componentInstance.action = Action.UPDATE;

        modalRef.result.then(async (result: CalendarEventWithMeta) => {
            const dto = mapCalendarEventToDto(result);
            const editedData = await this.dataService.updateDocument(
                CalendarService.CUSTOM_EVENT_COLLECTION, dto, { showSpinner: true });

            const calendarEvent = mapDtoToEvent(editedData);
            this.updateToEventsDisplay(calendarEvent, currentViewDate);
        }, err => { });
    }

    async deleteEvent(documentId: string): Promise<void> {
        const confirmation = confirm('After confirm the content will be deleted from the system.');
        if (!confirmation) return;

        await this.dataService.deleteDocument(
            CalendarService.CUSTOM_EVENT_COLLECTION, documentId, 
            { showSpinner: true, toastMessage: 'Event deleted' });

        this.calendarEvent$.pipe(takeOnce()).subscribe(events =>
            this.calendarEvent$.next(events.filter(filterEventsDocIdNotEqual(documentId))));
        this.dayEvent$.pipe(takeOnce()).subscribe(events =>
            this.dayEvent$.next(events.filter(filterEventsDocIdNotEqual(documentId))));
    }

    async addEvent(startDate: NullableDate): Promise<void> {
        const modalRef = this.ngbModalService.open(CalendarEventModalComponent, { centered: true });
        modalRef.componentInstance.event = { start: startDate };
        modalRef.componentInstance.action = Action.CREATE;

        modalRef.result.then(async (result: CalendarEventWithMeta) => {
            const dto = mapCalendarEventToDto(result);
            const addedEvent = await this.dataService.addDocument(
                CalendarService.CUSTOM_EVENT_COLLECTION, dto, 
                { showSpinner: true, toastMessage: 'Event added' });
                
            const calendarEvent = mapDtoToEvent(addedEvent);
            calendarEvent.meta!.editable = true;

            this.addToEventsDisplay(calendarEvent);
        }, err => { });
    }

    reload(): void {
        this.getCalendarEvents();
    }

    clearEvents(): void {
        this.dayEvent$.next([]);
    }

    private addToEventsDisplay(event: CalendarEventWithMeta): void {
        const calendarEvents = this.calendarEvent$.getValue();
        const dayEvents = this.dayEvent$.getValue();

        this.calendarEvent$.next(calendarEvents.concat(event));
        this.dayEvent$.next(dayEvents.concat(event));
    }

    private updateToEventsDisplay(event: CalendarEventWithMeta, currentViewDate: NullableDate): void {
        const calendarEvents = this.calendarEvent$.getValue().map(existingEvent =>
            existingEvent.meta?.documentId === event.meta?.documentId ? event : existingEvent);
        this.calendarEvent$.next(calendarEvents);

        let dayEvents = this.dayEvent$.getValue();

        const eventStart = moment(event.start).startOf(TimeUnit.day);
        const eventEnd = moment(event.end || currentViewDate).startOf(TimeUnit.day);
        const currentDate = moment(currentViewDate).startOf(TimeUnit.day);

        if (currentDate.isBetween(eventStart, eventEnd) || currentDate.isSame(eventStart)) {
            dayEvents = dayEvents.map(existingEvent => existingEvent.meta?.documentId === event.meta?.documentId ? event : existingEvent);
        } else {
            dayEvents = dayEvents.filter(existingEvent => existingEvent.meta?.documentId !== event.meta?.documentId);

        }
        this.dayEvent$.next(dayEvents);
    }

}
