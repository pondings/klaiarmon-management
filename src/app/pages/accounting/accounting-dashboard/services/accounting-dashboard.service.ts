import { Injectable } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Moment } from "moment";
import { Observable, Subject } from "rxjs";
import { ExpenseService } from "../../expense/services/expense.service";
import { BillingInfoModalComponent } from "../components/billing-info-modal/billing-info-modal.component";
import { UserBillingInfo } from "../model/user-billing-info.model";
import { UserBillingInfoService } from "./user-billing-info.service";

@Injectable()
export class AccountingDashboardService {

    userBillingInfo$ = new Subject<UserBillingInfo[]>();

    constructor(private userBillingInfoService: UserBillingInfoService,
        private expenseService: ExpenseService,
        private modalService: NgbModal) { }

    subscribeUserBillingInfos(): Observable<UserBillingInfo[]> {
        return this.userBillingInfo$.asObservable();
    }

    async showBillingInfo(billingInfo: UserBillingInfo): Promise<void> {
        const modalRef = this.modalService.open(BillingInfoModalComponent, { centered: true, backdrop: 'static' });
        modalRef.componentInstance.billingInfo = billingInfo;

        modalRef.componentInstance.viewExpenseInfo.subscribe(async (docId: string) => {
            const expense = await this.expenseService.getExpenseByDocumentId(docId);
            this.expenseService.viewExpense(expense);
        });
    }

    async getUserBillingInfos(targetMonth: Moment): Promise<void> {
        const userBillingInfos = await this.userBillingInfoService.getUserBillingInfos(targetMonth);
        this.userBillingInfo$.next(userBillingInfos);
    }

}
