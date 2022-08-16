import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { AccountingDashboardModule } from "./accounting-dashboard/accounting-dashboard.module";
import { AccountingDashboardService } from "./accounting-dashboard/services/accounting-dashboard.service";
import { UserBillingInfoService } from "./accounting-dashboard/services/user-billing-info.service";
import { ExpenseModule } from "./expense/expense.module";

@NgModule({
    providers: [AccountingDashboardService, UserBillingInfoService],
    imports: [
        CommonModule, 
        ExpenseModule, 
        AccountingDashboardModule
    ]
})
export class AccountingModule { }
