import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { CalendarModule } from "./calendar/calendar.module";
import { DashboardComponent } from "./dashboard/dashboard/dashboard.component";
import { DashboardRoutingModule } from "./dashboard-routing.module";
import { DocumentManagementModule } from "./document-management/document-management.module";

@NgModule({
    declarations: [DashboardComponent],
    imports: [
        CommonModule, 
        DashboardRoutingModule,
        CalendarModule,
        DocumentManagementModule
    ]
})
export class DashboardModule { }
