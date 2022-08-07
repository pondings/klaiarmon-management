import { Injectable } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { BehaviorSubject, filter, forkJoin, map, Observable, take } from "rxjs";
import { FirestoreService } from "src/app/core/services/firestore.service";
import { CalendarEventDto, CalendarEventWithMeta } from "../model/calendar";
import { CalendarEventModalComponent } from "../components/calendar-event-modal/calendar-event-modal.component";
import { Action } from "src/app/common/enum/action";
import { NullableDate } from "src/app/common/utils/date.util";
import { mergeForkArrays } from "src/app/common/utils/common-util";
import { mapCalendarDtoToEvents, mapCalendarEventToDto, mapToEditable, mapToUneditable } from "../utils/calendar.util";
import { LocalStorageService } from "src/app/core/services/local-storage.service";

@Injectable()
export class CalendarService {

    private static readonly PUBLIC_HOLIDAY_COLLECTION = 'calendar/event/public-holiday';
    private static readonly CUSTOM_EVENT_COLLECTION = 'calendar/event/custom-event';

    private calendarEvent$ = new BehaviorSubject<CalendarEventWithMeta[]>([]);
    private dayEvent$ = new BehaviorSubject<CalendarEventWithMeta[]>([]);

    constructor(private firestoreService: FirestoreService,
        private ngbModalService: NgbModal,
        private localStoreageService: LocalStorageService) { }

    getCalendarEvents(): Observable<CalendarEventWithMeta[]> {
        const holidayEvents = this.firestoreService.getCollection<CalendarEventDto>(CalendarService.PUBLIC_HOLIDAY_COLLECTION)
            .pipe(map(mapToUneditable));
        const customEvents = this.firestoreService.getCollection<CalendarEventDto>(CalendarService.CUSTOM_EVENT_COLLECTION)
            .pipe(map(mapToEditable));

        forkJoin([holidayEvents, customEvents]).pipe(map(mergeForkArrays), take(1), map(mapCalendarDtoToEvents))
            .subscribe(events => this.calendarEvent$.next(events));
        return this.calendarEvent$.asObservable();
    }

    getDayEvents(): Observable<CalendarEventWithMeta[]> {
        return this.dayEvent$.asObservable();
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
            const transactionsSuccess = await this.firestoreService.updateDocument(CalendarService.CUSTOM_EVENT_COLLECTION, [dto]);
            const calendarEvent = mapCalendarDtoToEvents(transactionsSuccess.data)[0];

            this.updateToEventsDisplay(calendarEvent, currentViewDate);
            transactionsSuccess.toast.showSuccess('Event updated');
        }, err => {});
    }

    async deleteEvent(documentId: string): Promise<void> {
        const confirmation = confirm('After confirm the content will be deleted from the system.');
        if (!confirmation) return;

        await this.firestoreService.deleteDocument(CalendarService.CUSTOM_EVENT_COLLECTION, documentId)
            .then(toast => toast.showSuccess('Event deleted'));
        this.calendarEvent$.pipe(take(1)).subscribe(events => 
            this.calendarEvent$.next(events.filter(event => event.meta?.documentId !== documentId)));
        this.dayEvent$.pipe(take(1)).subscribe(events => 
            this.dayEvent$.next(events.filter(event => event.meta?.documentId !== documentId)));
    }

    async addEvent(startDate: NullableDate): Promise<void> {
        const modalRef = this.ngbModalService.open(CalendarEventModalComponent, { centered: true });
        modalRef.componentInstance.event = { start: startDate };
        modalRef.componentInstance.action = Action.CREATE;

        modalRef.result.then(async (result: CalendarEventWithMeta) => {
            const dto = mapCalendarEventToDto(result);
            const transactionsSuccess = await this.firestoreService.addToCollection(CalendarService.CUSTOM_EVENT_COLLECTION, [dto]);
            const calendarEvent = mapCalendarDtoToEvents(transactionsSuccess.data)[0];
            calendarEvent.meta!.editable = true;

            this.addToEventsDisplay(calendarEvent);
            transactionsSuccess.toast.showSuccess('Event added');
        }, err => { });
    }

    reload(): Observable<CalendarEventWithMeta[]> {
        this.localStoreageService.clear(CalendarService.CUSTOM_EVENT_COLLECTION);
        this.localStoreageService.clear(CalendarService.PUBLIC_HOLIDAY_COLLECTION);

        return this.getCalendarEvents();
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
        if (event.start === currentViewDate) {
            dayEvents = dayEvents.map(existingEvent => existingEvent.meta?.documentId === event.meta?.documentId ? event : existingEvent);
        } else {
            dayEvents = dayEvents.filter(existingEvent => existingEvent.meta?.documentId !== event.meta?.documentId);
        }
        this.dayEvent$.next(dayEvents);
    }

}
