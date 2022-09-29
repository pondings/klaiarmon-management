import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { CalendarModule } from "./calendar/calendar.module";
import { DashboardRoutingModule } from "./dashboard-routing.module";
import { DocumentManagementModule } from "./document-management/document-management.module";
import { MemoModule } from "./memo/memo.module";
import { DashboardHomeModule } from "./dashboard/dashboard-home.module";

@NgModule({
    imports: [
        CommonModule, 
        DashboardRoutingModule,
        CalendarModule,
        DocumentManagementModule,
        MemoModule,
        DashboardHomeModule
    ]
})
export class DashboardModule { }
