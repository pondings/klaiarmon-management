import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { GoogleMapsModule } from "@angular/google-maps";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { NgbCollapseModule, NgbTypeaheadModule } from "@ng-bootstrap/ng-bootstrap";
import { CalendarCommonModule, CalendarMonthModule } from "angular-calendar";
import { ConfirmModalModule } from "src/app/shared/components/modal/confirm-modal.module";
import { GoogleMapsLoaderService } from "src/app/shared/services/google-maps-loader.service";
import { SharedModule } from "src/app/shared/shared.module";
import { EventInfoComponent } from "./components/calendar-event-info/event-info.component";
import { CalendarEventModalComponent } from "./components/calendar-event-modal/calendar-event-modal.component";
import { CalendarComponent } from "./containers/calendar/calendar.component";
import { CalendarNotificationService } from "./services/calendar-notification.service";
import { CalendarService } from "./services/calendar.service";

@NgModule({
    declarations: [
        CalendarComponent,
        CalendarEventModalComponent,
        EventInfoComponent
    ],
    providers: [
        CalendarService,
        GoogleMapsLoaderService,
        CalendarNotificationService
    ],
    imports: [
        CommonModule,
        SharedModule,
        CalendarMonthModule,
        CalendarCommonModule,
        FontAwesomeModule,
        NgbCollapseModule,
        ConfirmModalModule,
        GoogleMapsModule,
        NgbTypeaheadModule
    ]
})
export class CalendarModule {}
