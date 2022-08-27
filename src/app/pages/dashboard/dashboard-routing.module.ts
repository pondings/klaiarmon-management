import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CalendarComponent } from "./calendar/containers/calendar/calendar.component";
import { DashboardComponent } from "./dashboard/dashboard/dashboard.component";
import { DocumentManagementComponent } from "./document-management/containers/document-management.component";
import { MemoSearchComponent } from "./memo/containers/memo-search/memo-search.component";

const routes: Routes = [
    { path: '', component: DashboardComponent },
    { path: 'calendar', component: CalendarComponent },
    { path: 'document', component: DocumentManagementComponent },
    { path: 'memo', component: MemoSearchComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DashboardRoutingModule { }
