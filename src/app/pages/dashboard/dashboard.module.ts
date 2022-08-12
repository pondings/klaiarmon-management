import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { CalendarComponent } from "./containers/calendar/calendar.component";
import { DashboardComponent } from "./containers/dashboard/dashboard.component";
import { DashboardRoutingModule } from "./dashboard-routing.module";
import { CalendarMonthModule, CalendarCommonModule } from 'angular-calendar';
import { SharedModule } from "src/app/shared/shared.module";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { CalendarEventModalComponent } from "./components/calendar-event-modal/calendar-event-modal.component";
import { EventInfoComponent } from "./components/calendar-event-info/event-info.component";
import { CalendarService } from "./services/calendar.service";
import { NgbCollapseModule, NgbDateParserFormatter, NgbTypeaheadModule } from "@ng-bootstrap/ng-bootstrap";
import { ConfirmModalModule } from "src/app/shared/components/modal/confirm-modal.module";
import { GoogleMapsModule } from "@angular/google-maps";
import { GoogleMapsLoaderService } from "src/app/shared/services/google-maps-loader.service";

@NgModule({
    declarations: [
        DashboardComponent,
        CalendarComponent,
        CalendarEventModalComponent,
        EventInfoComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        DashboardRoutingModule,
        CalendarMonthModule,
        CalendarCommonModule,
        FontAwesomeModule,
        NgbCollapseModule,
        ConfirmModalModule,
        GoogleMapsModule,
        NgbTypeaheadModule
    ],
    providers: [
        CalendarService,
        GoogleMapsLoaderService
    ]
})
export class DashboardModule { }
