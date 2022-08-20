import { Injectable } from "@angular/core";
import { QueryFn } from "@angular/fire/compat/firestore";
import * as moment from "moment";
import { Moment } from "moment";
import { UserInfo } from "src/app/core/models/user.model";
import { DataService } from "src/app/core/services/data-service";
import { FireAuthService } from "src/app/core/services/fire-auth.service";
import { Expense } from "../../expense/model/expense.model";
import { ExpenseService } from "../../expense/services/expense.service";
import { BillingInfo, BillingItem, BillingResult, PaymentAction, UserBillingInfo } from "../model/user-billing-info.model";

type HasUserUid = { user: string };

@Injectable()
export class UserBillingInfoService {

    constructor(private dataService: DataService,
        private fireAuthService: FireAuthService) {}

    async getUserBillingInfos(targetMonth: Moment): Promise<UserBillingInfo[]> {
        const startMonth = moment(targetMonth.toObject()).startOf('month');
        const endMonth = moment(targetMonth.toObject()).endOf('month');
        const query: QueryFn = ref => ref.where('date', '>=', startMonth?.toDate())
            .where('date', '<=', endMonth?.toDate());

        const expenses = await this.dataService.getCollection<Expense>(ExpenseService.EXPENSE_COLLECTION_PATH, { showSpinner: true, query });
        const users = await this.fireAuthService.getAllUsers();
        let userBillingInfos = this.calculateDebtors(expenses, users);
        userBillingInfos = this.calculateCreditors(userBillingInfos);
        userBillingInfos = this.calculateResult(userBillingInfos);
        return userBillingInfos;
    }

    private calculateResult(userBillingInfos: UserBillingInfo[]): UserBillingInfo[] {
        return userBillingInfos.map(userBillingInfo => {
            let result: BillingResult[] = [];
            userBillingInfo.creditors.forEach(creditor => {
                const existing = result.find(this.uidMatchWith(creditor.user));
                !!existing ? existing.amount -= creditor.amount : result.push({ user: creditor.user, amount: -creditor.amount })
            });
            userBillingInfo.debtors.forEach(debtor => {
                const existing = result.find(this.uidMatchWith(debtor.user));
                !!existing ? existing.amount += debtor.amount : result.push({ ...debtor });
            });
            result = result.map(rs => {
                rs.paymentAction = rs.amount > 0 ? PaymentAction.RECEIVE : rs.amount < 0 ? PaymentAction.PAY : PaymentAction.NOTHING;
                rs.amount = Math.abs(rs.amount);
                return rs;
            });

            userBillingInfo.results = result;
            return userBillingInfo;
        });
    }

    private calculateCreditors(userBillingInfos: UserBillingInfo[]): UserBillingInfo[] {
        return userBillingInfos.map(userBillingInfo => {
            userBillingInfo.creditors = userBillingInfos.filter(this.uidNotMatchWith(userBillingInfo.user))
                .map(nu => nu.debtors.filter(this.uidMatchWith(userBillingInfo.user))
                    .map(this.mapOverideUid(nu.user)))
                .reduce(this.mergeArray, []);
            return userBillingInfo;
        });
    }

    private calculateDebtors(expenses: Expense[], users: UserInfo[]): UserBillingInfo[] {
        return users.map<UserBillingInfo>(user => {
            const userExpense = expenses.filter(this.filterExpensePaidByByUser(user));
            const debtors = userExpense.map(this.mapToBillingInfo)
                .reduce(this.mergeArray, [])
                .filter(this.uidNotMatchWith(user.uid!))
                .reduce(this.calculateDebtorAmount, [])
                .map(debtor => {
                    const debtorExpenss = userExpense.filter(exp => exp.billings.find(this.uidMatchWith(debtor.user)));
                    debtor.items = debtorExpenss.map<BillingItem>(de => ({
                        name: de.name,
                        amount: de.billings.find(this.uidMatchWith(debtor.user))?.amount!
                    }));

                    return debtor;
                })
            const expenseAmount = userExpense.map(this.mapToAmount).reduce(this.sumNumber, 0);

            return { user: user.uid!, debtors, expenses: userExpense, expenseAmount, creditors: [], results: [] };
        });
    }

    private calculateDebtorAmount: (debtors: BillingInfo[], debtor: BillingInfo) => BillingInfo[] = (debtors, debtor) => {
        const existDebtor = debtors.find(this.uidMatchWith(debtor.user));
        if (existDebtor) existDebtor.amount += debtor.amount;
        return existDebtor ? debtors : debtors.concat(debtor);
    }

    private mapToBillingInfo: (expense: Expense) => BillingInfo[] = expense => expense.billings.map(billing => ({ ...billing, items: [] }));
    private mapToAmount: (expense: Expense) => number = expense => expense.amount;
    private mergeArray: <T>(prev: T[], cur: T[]) => T[] = (prev, cur) => prev.concat(cur);
    private sumNumber: (prev: number, cur: number) => number = (prev, cur) => prev + cur;

    private uidNotMatchWith(uid: string): (target: HasUserUid) => boolean {
        return target => target.user !== uid;
    }
    private uidMatchWith(uid: string): (target: HasUserUid) => boolean {
        return target => target.user === uid;
    }
    private mapOverideUid<T extends HasUserUid>(uid: string): (target: T) => T {
        return target => ({ ...target, user: uid });
    }

    private filterExpensePaidByByUser(userInfo: UserInfo): (expense: Expense) => boolean {
        return expense => expense.paidBy === userInfo.uid;
    }

}