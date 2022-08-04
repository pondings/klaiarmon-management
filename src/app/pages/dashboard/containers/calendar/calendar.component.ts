import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from "@angular/core";
import * as moment from 'moment';
import { map, Observable } from "rxjs";
import { FirestoreService } from "src/app/shared/services/firestore.service";
import { CalendarEvent, CalendarView } from 'angular-calendar';
import { CalendarDayEvent, CalendarEventDto, EventCreatedBy } from "../../model/calendar";
import { faChevronLeft, faChevronRight, faPlus } from "@fortawesome/free-solid-svg-icons";
import { TimeUnit } from "src/app/shared/model/time-unit";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AddEventModalComponent } from "../../components/add-event-modal/add-event-modal.component";

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
    faPlus = faPlus;

    calendarEvent$!: Observable<CalendarEvent<EventCreatedBy>[]>;

    constructor(private firestoreService: FirestoreService,
        private ngbModalService: NgbModal) {}

    async ngOnInit(): Promise<void> {
        this.calendarEvent$ = this.firestoreService.getCollection<CalendarEventDto>('calendar/event/public-holiday')
            .pipe(map(dtoList => this.mapDtoToCalendarEvent(dtoList)));
    }

    onSwipe(event: any): void {
        const next = Math.abs(event.deltaX) > 40 ? (event.deltaX > 0 ? -1 : 1) : 0;
        this.viewDate = moment(this.viewDate).add(next, TimeUnit.month).toDate();
    }

    viewEvent(event: CalendarDayEvent): void {
        const modalRef = this.ngbModalService.open(AddEventModalComponent, { centered: true });
        modalRef.componentInstance.event = event.day.events[0];
    }

    addEvent(event?: CalendarEvent): void {
        const modalRef = this.ngbModalService.open(AddEventModalComponent, { centered: true });
        modalRef.componentInstance.event = { start: moment().toDate() };
        modalRef.result.then(console.log, console.error);
    }

    private mapDtoToCalendarEvent(dtoList: CalendarEventDto[]): CalendarEvent[] {
        return dtoList.map(dto => ({ ...dto, start: this.mapStringToDate(dto.start) }));
    }

    private mapStringToDate(dateString: string): Date {
        return moment(dateString).toDate();
    }

}
