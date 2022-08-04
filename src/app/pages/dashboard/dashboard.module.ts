import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { CalendarComponent } from "./containers/calendar/calendar.component";
import { DashboardComponent } from "./containers/dashboard/dashboard.component";
import { DashboardRoutingModule } from "./dashboard-routing.module";
import { CalendarMonthModule, CalendarCommonModule } from 'angular-calendar';
import { SharedModule } from "src/app/shared/shared.module";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { AddEventModalComponent } from "./components/add-event-modal/add-event-modal.component";

@NgModule({
    declarations: [
        DashboardComponent,
        CalendarComponent,
        AddEventModalComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        DashboardRoutingModule,
        CalendarMonthModule,
        CalendarCommonModule,
        FontAwesomeModule
    ]
})
export class DashboardModule { }
