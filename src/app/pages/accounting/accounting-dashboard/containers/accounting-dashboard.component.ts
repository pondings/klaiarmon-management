import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from "@angular/core";
import { Moment } from "moment";
import { Observable } from "rxjs";
import { getMoment } from "src/app/common/utils/moment.util";
import { PaymentAction, UserBillingInfo } from "../model/user-billing-info.model";
import { AccountingDashboardService } from "../services/accounting-dashboard.service";

@Component({
    selector: 'app-accounting-dashboard',
    templateUrl: './accounting-dashboard.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class AccountingDashboardComponent implements OnInit {

    paymentAction = PaymentAction;

    userBillingInfos$!: Observable<UserBillingInfo[]>

    constructor(private accountingDashboardService: AccountingDashboardService) {}

    async ngOnInit(): Promise<void> {
        this.userBillingInfos$ = this.accountingDashboardService.subscribeUserBillingInfos();
        this.accountingDashboardService.getUserBillingInfos(getMoment()!);
    }

    periodChange(date: Moment) {
        this.accountingDashboardService.getUserBillingInfos(date);
    }

}
