import { Injectable } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Action } from "src/app/common/enum/action";
import { ExpenseModalComponent } from "src/app/pages/accounting/expense/components/expense-modal/expense-modal.component";
import { Expense } from "src/app/pages/accounting/expense/model/expense.model";
import { ExpenseCommonService } from "src/app/pages/accounting/expense/services/expense-common.service";
import { ExpenseSearchingService } from "src/app/pages/accounting/expense/services/expense-searching.service";
import { ExpenseUpdationService } from "src/app/pages/accounting/expense/services/expense-updation.service";

@Injectable()
export class ExpenseAlertService {

    constructor(private modalService: NgbModal,
        private expenseCommonService: ExpenseCommonService,
        private expenseSearchingService: ExpenseSearchingService,
        private expenseUpdationService: ExpenseUpdationService) {}

    async subscribeExpenseAlert(): Promise<void> {
        const expenseAlerts = await this.expenseSearchingService.searchByStatus('ALERT');

        await Promise.all(expenseAlerts.map(async expenseAlert => {
            const expenseFormValue = await this.expenseCommonService.getExpenseFormValueFromExpense(expenseAlert);
            const modalRef = this.modalService.open(ExpenseModalComponent, { centered: true, backdrop: 'static' });
            modalRef.componentInstance.action = Action.EXPENSE_ALERT;
            modalRef.componentInstance.expense = expenseFormValue;

            await modalRef.result.then(async (expense: Expense) => {
                expense.files = await Promise.all(expense.files.map(async file => file.file ? await this.expenseCommonService.uploadFile(file) : file));
                expense.status = 'DONE';
                await this.expenseUpdationService.update(expense);
            }, err => { });
        }));
    }

}
