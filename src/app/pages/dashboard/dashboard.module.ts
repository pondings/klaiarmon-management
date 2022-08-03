import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { CalendarComponent } from "./containers/calendar/calendar.component";
import { DashboardComponent } from "./containers/dashboard/dashboard.component";
import { DashboardRoutingModule } from "./dashboard-routing.module";
import { CalendarMonthModule } from 'angular-calendar';

@NgModule({
    declarations: [DashboardComponent, CalendarComponent],
    imports: [CommonModule, DashboardRoutingModule, CalendarMonthModule]
})
export class DashboardModule { }
