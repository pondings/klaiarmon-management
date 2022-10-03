import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { AccountingDashboardModule } from "./accounting-dashboard/accounting-dashboard.module";
import { ExpenseModule } from "./expense/expense.module";
import { RecurringExpenseModule } from "./recurring-expense/recurring-expense.module";

@NgModule({
    imports: [
        CommonModule, 
        ExpenseModule, 
        AccountingDashboardModule,
        RecurringExpenseModule
    ]
})
export class AccountingModule { }
