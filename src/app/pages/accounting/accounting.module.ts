import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { AccountingRoutingModule } from "./accounting-routing.module";
import { AccountingComponent } from "./containers/accounting/accounting.component";
import { ExpenseComponent } from "./containers/expense/expense.component";

@NgModule({
    declarations: [AccountingComponent, ExpenseComponent],
    imports: [CommonModule, AccountingRoutingModule]
})
export class AccountingModule { }
