import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { AccountingRoutingModule } from "./accounting-routing.module";
import { AccountingComponent } from "./containers/accounting/accounting.component";
import { TransactionComponent } from "./containers/transaction/transaction.component";

@NgModule({
    declarations: [AccountingComponent, TransactionComponent],
    imports: [CommonModule, AccountingRoutingModule]
})
export class AccountingModule { }
