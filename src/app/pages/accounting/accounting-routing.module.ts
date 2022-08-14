import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AccountingDashboardComponent } from "./accounting-dashboard/containers/accounting-dashboard.component";
import { ExpenseComponent } from "./expense/containers/expense/expense.component";

const routes: Routes = [
    { path: '', component: AccountingDashboardComponent },
    { path: 'expense', component: ExpenseComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AccountingRoutingModule {

}
