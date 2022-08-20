import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { NgbCollapseModule } from "@ng-bootstrap/ng-bootstrap";
import { NgChartsModule } from "ng2-charts";
import { UsernamePipe } from "src/app/shared/pipe/username.pipe";
import { SharedModule } from "src/app/shared/shared.module";
import { BillingInfoModalComponent } from "./components/billing-info-modal/billing-info-modal.component";
import { ExpenseChartInfoComponent } from "./components/expense-chart-info/expense-chart-info.component";
import { AccountingDashboardComponent } from "./containers/accounting-dashboard.component";
import { AccountingDashboardService } from "./services/accounting-dashboard.service";
import { UserBillingInfoService } from "./services/user-billing-info.service";

@NgModule({
    declarations: [
        AccountingDashboardComponent, 
        ExpenseChartInfoComponent,
        BillingInfoModalComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        NgChartsModule,
        NgbCollapseModule,
        FontAwesomeModule
    ],
    providers: [
        UsernamePipe,
        AccountingDashboardService, 
        UserBillingInfoService
    ]
})
export class AccountingDashboardModule {}
