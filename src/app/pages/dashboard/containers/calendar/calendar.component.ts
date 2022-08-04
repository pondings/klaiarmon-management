import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from "@angular/core";
import * as moment from 'moment';
import { Observable } from "rxjs";
import { FirestoreService } from "src/app/shared/services/firestore.service";

@Component({
    selector: 'app-calendar',
    templateUrl: './calendar.component.html',
    styleUrls: ['./calendar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class CalendarComponent implements OnInit { 

    viewDate = moment().toDate();

    thailandHoliday$!: Observable<any>;

    constructor(private firestoreService: FirestoreService) {}

    ngOnInit(): void {
        this.thailandHoliday$ = this.firestoreService.getCollection('calendar/holiday/public-holiday');
    }

}
