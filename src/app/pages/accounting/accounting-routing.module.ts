import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AccountingComponent } from "./containers/accounting/accounting.component";
import { ExpenseComponent } from "./containers/expense/expense.component";

const routes: Routes = [
    { path: '', component: AccountingComponent },
    { path: 'expense', component: ExpenseComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AccountingRoutingModule {

}
