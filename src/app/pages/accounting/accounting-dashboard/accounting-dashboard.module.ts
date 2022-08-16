import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NgChartsModule } from "ng2-charts";
import { UsernamePipe } from "src/app/shared/pipe/username.pipe";
import { SharedModule } from "src/app/shared/shared.module";
import { ExpenseChartInfoComponent } from "./compments/expense-chart-info/expense-chart-info.component";
import { UserBillingInfoComponent } from "./compments/user-billing-info/user-billing-info.component";
import { AccountingDashboardComponent } from "./containers/accounting-dashboard.component";

@NgModule({
    declarations: [
        AccountingDashboardComponent, 
        UserBillingInfoComponent, 
        ExpenseChartInfoComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        NgChartsModule
    ],
    providers: [UsernamePipe]
})
export class AccountingDashboardModule {}
