import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { CalendarEventWithMeta } from "../../../calendar/models/calendar";
import { DashboardService } from "../../services/dashboard.service";

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit {

    incomingEvents$!: Observable<CalendarEventWithMeta[]>;
    incomingHoliday$!: Observable<CalendarEventWithMeta[]>;

    isContentReady$ = new BehaviorSubject(false);

    constructor(private dashboardService: DashboardService) {}

    async ngOnInit(): Promise<void> {
        this.incomingEvents$ = this.dashboardService.subscribeIncomingEvent();
        this.incomingHoliday$ = this.dashboardService.subscribeIncomingHoliday();

        await this.dashboardService.fetchIncomingEvents();
        await this.dashboardService.fetchIncomingHoliday();
        this.isContentReady$.next(true);
    }

    getDirectionLink(event: CalendarEventWithMeta): string {
        const placeId = event.meta?.place?.placeId;
        return `https://www.google.com/maps/dir/?api=1&destination=${placeId}&destination_place_id=${placeId}&travelmode=driving`;
    }

}
