import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from "@angular/core";
import { AngularFirestore } from '@angular/fire/compat/firestore';
import * as moment from 'moment';
import { finalize, Observable, take, tap } from "rxjs";
import { SpinnerService } from "src/app/core/spinner/spinner.service";
import { environment } from "src/environments/environment";

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

    constructor(private angularFireStore: AngularFirestore,
        private spinnerService: SpinnerService) { }

    ngOnInit(): void {
        this.spinnerService.show();
        this.thailandHoliday$ = this.angularFireStore.doc(`calendar/${environment.firebase.firestoreHolidaySecret}`)
            .valueChanges().pipe(tap(() => this.spinnerService.hide()));
    }

}
