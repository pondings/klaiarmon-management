import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { SharedModule } from "src/app/shared/shared.module";
import { UserBillingInfoComponent } from "./compments/user-billing-info/user-billing-info.component";
import { AccountingDashboardComponent } from "./containers/accounting-dashboard.component";

@NgModule({
    declarations: [AccountingDashboardComponent, UserBillingInfoComponent],
    imports: [CommonModule, SharedModule]
})
export class AccountingDashboardModule {}
