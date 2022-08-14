import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { AccountingComponent } from "./containers/accounting/accounting.component";
import { ExpenseModule } from "./expense/expense.module";

@NgModule({
    declarations: [AccountingComponent],
    imports: [CommonModule, ExpenseModule]
})
export class AccountingModule { }
