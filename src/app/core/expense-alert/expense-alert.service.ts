import { Injectable } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Action } from "src/app/common/enum/action";
import { filterByEqual } from "src/app/common/utils/common-util";
import { ExpenseModalComponent } from "src/app/pages/accounting/expense/components/expense-modal/expense-modal.component";
import { Expense } from "src/app/pages/accounting/expense/model/expense.model";
import { ExpenseCommonService } from "src/app/pages/accounting/expense/services/expense-common.service";
import { ExpenseNotificationService } from "src/app/pages/accounting/expense/services/expense-notification.service";
import { ExpenseSearchingService } from "src/app/pages/accounting/expense/services/expense-searching.service";
import { ExpenseUpdationService } from "src/app/pages/accounting/expense/services/expense-updation.service";
import { FireAuthService } from "../services/fire-auth.service";

@Injectable()
export class ExpenseAlertService {

    constructor(private modalService: NgbModal,
        private expenseCommonService: ExpenseCommonService,
        private expenseSearchingService: ExpenseSearchingService,
        private expenseUpdationService: ExpenseUpdationService,
        private expenseNotificationService: ExpenseNotificationService,
        private fireAuthService: FireAuthService) {}

    async fetchExpenseAlert(): Promise<void> {
        const expenseAlerts = await this.expenseSearchingService.searchByStatus('ALERT');
        const currentUser = await this.fireAuthService.getCurrentUser();

        await Promise.all(expenseAlerts.filter(filterByEqual('paidBy', currentUser.uid!)).map(async expenseAlert => {
            const expenseFormValue = await this.expenseCommonService.getExpenseFormValueFromExpense(expenseAlert);
            const modalRef = this.modalService.open(ExpenseModalComponent, { centered: true, backdrop: 'static' });
            modalRef.componentInstance.action = Action.EXPENSE_ALERT;
            modalRef.componentInstance.expense = expenseFormValue;

            await modalRef.result.then(async (expense: Expense) => {
                expense.files = await Promise.all(expense.files.map(async file => file.file ? await this.expenseCommonService.uploadFile(file) : file));
                expense.status = 'DONE';
                await this.expenseUpdationService.update(expense);
                await this.expenseNotificationService.pushNotification(expense, Action.CREATE);
            }, err => { });
        }));
    }

}
