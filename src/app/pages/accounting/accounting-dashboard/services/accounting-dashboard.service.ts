import { Injectable } from "@angular/core";
import { Moment } from "moment";
import { Observable, Subject } from "rxjs";
import { UserBillingInfo } from "../model/user-billing-info.model";
import { UserBillingInfoService } from "./user-billing-info.service";

@Injectable()
export class AccountingDashboardService {

    userBillingInfo$ = new Subject<UserBillingInfo[]>();

    constructor(private userBillingInfoService: UserBillingInfoService) { }

    subscribeUserBillingInfos(): Observable<UserBillingInfo[]> {
        return this.userBillingInfo$.asObservable();
    }

    async getUserBillingInfos(targetMonth: Moment): Promise<void> {
        const userBillingInfos = await this.userBillingInfoService.getUserBillingInfos(targetMonth);
        this.userBillingInfo$.next(userBillingInfos);
    }

}
