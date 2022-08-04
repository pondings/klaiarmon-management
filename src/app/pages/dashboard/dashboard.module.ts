import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { CalendarComponent } from "./containers/calendar/calendar.component";
import { DashboardComponent } from "./containers/dashboard/dashboard.component";
import { DashboardRoutingModule } from "./dashboard-routing.module";
import { CalendarMonthModule, CalendarCommonModule } from 'angular-calendar';
import { SharedModule } from "src/app/shared/shared.module";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

@NgModule({
    declarations: [DashboardComponent, CalendarComponent],
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
