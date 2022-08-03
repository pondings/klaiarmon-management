import { ChangeDetectionStrategy, Component, ViewEncapsulation } from "@angular/core";
import { CalendarMomentDateFormatter } from 'angular-calendar';
import { CustomDateFormatter } from "../../services/calendar-date-formatter.service";

@Component({
    selector: 'app-calendar',
    templateUrl: './calendar.component.html',
    styleUrls: ['./calendar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class CalendarComponent { 

    viewDate = new Date();

}
