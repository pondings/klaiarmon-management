import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AccountingComponent } from "./containers/accounting/accounting.component";
import { TransactionComponent } from "./containers/transaction/transaction.component";

const routes: Routes = [
    { path: '', component: AccountingComponent },
    { path: 'transaction', component: TransactionComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AccountingRoutingModule {

}
