import { Injectable } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { BehaviorSubject, forkJoin, map, Observable, take } from "rxjs";
import { FirestoreService } from "src/app/core/services/firestore.service";
import { CalendarEventDto } from "../model/calendar";
import { CalendarEvent } from "angular-calendar";
import { MetaData } from "src/app/model/meta-data";
import { AddEventModalComponent } from "../components/calendar-event-modal/calendar-event-modal.component";
import { Action } from "src/app/common/enum/action";
import { NullableDate } from "src/app/common/utils/date.util";
import { Timestamp } from "firebase/firestore";
import { ToastService } from "src/app/core/toast/toast.service";

@Injectable()
export class CalendarService {

    private static readonly PUBLIC_HOLIDAY_COLLECTION = 'calendar/event/public-holiday';
    private static readonly CUSTOM_EVENT_COLLECTION = 'calendar/event/custom-event';

    private calendarEvent$ = new BehaviorSubject<CalendarEvent<MetaData>[]>([]);

    constructor(private firestoreService: FirestoreService,
        private ngbModalService: NgbModal,
        private toastService: ToastService) { }

    getCalendarEvents(): Observable<CalendarEvent<MetaData>[]> {
        const holidayEvents = this.firestoreService.getCollection<CalendarEventDto>(CalendarService.PUBLIC_HOLIDAY_COLLECTION);
        const customEvents = this.firestoreService.getCollection<CalendarEventDto>(CalendarService.CUSTOM_EVENT_COLLECTION);

        forkJoin([holidayEvents, customEvents]).pipe(map(this.mergeForkArray), take(1), map(this.mapCalendarDtoToEvents))
            .subscribe(events => this.calendarEvent$.next(events));
        return this.calendarEvent$.asObservable();
    }

    updateEvent(event: CalendarEvent<MetaData>): void {

    }

    async deleteEvent(documentId: string): Promise<void> {
        await this.firestoreService.deleteDocument(CalendarService.CUSTOM_EVENT_COLLECTION, documentId)
            .then(toast => toast.showSuccess('Deleted'));
        this.calendarEvent$.pipe(take(1)).subscribe(events => this.calendarEvent$.next(events.filter(event => event.meta?.documentId !== documentId)));
    }

    async addEvent(startDate: NullableDate): Promise<CalendarEvent<MetaData>> {
        const modalRef = this.ngbModalService.open(AddEventModalComponent, { centered: true });
        modalRef.componentInstance.event = { start: startDate };
        modalRef.componentInstance.action = Action.CREATE;

        return new Promise(async (resolve) => {
            modalRef.result.then(async (result: CalendarEvent<MetaData>) => {
                const dto = this.mapCalendarEventToDto(result);
                const addedEvent = await this.firestoreService.addToCollection(CalendarService.CUSTOM_EVENT_COLLECTION, [dto]);
                const calendarEvent = this.mapCalendarDtoToEvents(addedEvent)[0];
                this.updateCalendarEventSubscribe(calendarEvent);
                this.toastService.showSuccess('Add event successfully');

                return resolve(calendarEvent);
            }, err => {});
        });
    }

    private updateCalendarEventSubscribe(calendarEvent: CalendarEvent<MetaData>): void {
        this.calendarEvent$.pipe(take(1)).subscribe(events => this.calendarEvent$.next(events.concat(calendarEvent)));
    }

    private mapCalendarEventToDto(calendarEvent: CalendarEvent<MetaData>): CalendarEventDto {
        const { title, start, end, meta } = calendarEvent;
        return {
            title,
            start: Timestamp.fromDate(start),
            end: (end ? Timestamp.fromDate(end) : null)!,
            meta: meta || {},
            allDay: true
        };
    }

    private mapCalendarDtoToEvents(events: CalendarEventDto[]): CalendarEvent<MetaData>[] {
        return events.map(event => ({
            ...event,
            start: event.start?.toDate(),
            end: event.end?.toDate()
        }));
    }

    private mergeForkArray<T>(arr: [T[], T[]]): T[] {
        const arr1 = arr[0] || [];
        const arr2 = arr[1] || [];
        return arr1.concat(arr2);
    }

}
