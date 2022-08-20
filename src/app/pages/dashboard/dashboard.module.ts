import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { CalendarModule } from "./calendar/calendar.module";
import { DashboardComponent } from "./dashboard/dashboard/dashboard.component";
import { DashboardRoutingModule } from "./dashboard-routing.module";

@NgModule({
    declarations: [DashboardComponent],
    imports: [
        CommonModule, 
        DashboardRoutingModule,
        CalendarModule
    ]
})
export class DashboardModule { }
