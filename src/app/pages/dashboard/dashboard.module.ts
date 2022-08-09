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
import { NgbCollapseModule, NgbDateParserFormatter } from "@ng-bootstrap/ng-bootstrap";
import { ConfirmModalModule } from "src/app/shared/components/modal/confirm-modal.module";

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
        ConfirmModalModule
    ],
    providers: [
        CalendarService
    ]
})
export class DashboardModule { }
