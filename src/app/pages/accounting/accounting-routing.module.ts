import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AccountingDashboardComponent } from "./accounting-dashboard/containers/accounting-dashboard.component";
import { ExpenseComponent } from "./expense/containers/expense/expense.component";
import { RecurringExpenseComponet } from "./recurring-expense/containers/recurring-expense/recurring-expense.component";

const routes: Routes = [
    { path: '', component: AccountingDashboardComponent },
    { path: 'expense', component: ExpenseComponent },
    { path: 'recurring-expense', component: RecurringExpenseComponet }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AccountingRoutingModule {

}
