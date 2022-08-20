import { Injectable } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Moment } from "moment";
import { Observable, Subject } from "rxjs";
import { BillingInfoModalComponent } from "../compments/billing-info-modal/billing-info-modal.component";
import { UserBillingInfo } from "../model/user-billing-info.model";
import { UserBillingInfoService } from "./user-billing-info.service";

@Injectable()
export class AccountingDashboardService {

    userBillingInfo$ = new Subject<UserBillingInfo[]>();

    constructor(private userBillingInfoService: UserBillingInfoService,
        private modalService: NgbModal) { }

    subscribeUserBillingInfos(): Observable<UserBillingInfo[]> {
        return this.userBillingInfo$.asObservable();
    }

    async showBillingInfo(billingInfo: UserBillingInfo): Promise<void> {
        const modalRef = this.modalService.open(BillingInfoModalComponent, { centered: true, backdrop: 'static' });
        modalRef.componentInstance.billingInfo = billingInfo;
    }

    async getUserBillingInfos(targetMonth: Moment): Promise<void> {
        const userBillingInfos = await this.userBillingInfoService.getUserBillingInfos(targetMonth);
        this.userBillingInfo$.next(userBillingInfos);
    }

}
