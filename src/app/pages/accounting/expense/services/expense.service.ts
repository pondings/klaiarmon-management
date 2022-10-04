import { Injectable } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Timestamp } from "firebase/firestore";
import { BehaviorSubject, Observable } from "rxjs";
import { Action } from "src/app/common/enum/action";
import { isEmptyList } from "src/app/common/utils/common-util";
import { takeOnce } from "src/app/common/utils/rxjs-util";
import { ToastService } from "src/app/core/toast/toast.service";
import { ImageViewerComponent } from "src/app/shared/components/image-viewer/image-viewer.component";
import { ExpenseModalComponent } from "../components/expense-modal/expense-modal.component";
import { Expense, ExpenseSearch } from "../model/expense.model";
import { ExpenseCommonService } from "./expense-common.service";
import { ExpenseCreationService } from "./expense-creation.service";
import { ExpenseDeletationService } from "./expense-deletation.service";
import { ExpenseNotificationService } from "./expense-notification.service";
import { ExpenseSearchingService } from "./expense-searching.service";
import { ExpenseUpdationService } from "./expense-updation.service";

@Injectable()
export class ExpenseService {

    static readonly EXPENSE_COLLECTION_PATH = 'accounting/expense/data';

    private expenses$ = new BehaviorSubject<Expense[]>([]);

    constructor(private toastService: ToastService,
        private modalService: NgbModal,
        private expenseCommonService: ExpenseCommonService,
        private expenseSearchingService: ExpenseSearchingService,
        private expenseCreationService: ExpenseCreationService,
        private expenseUpdationService: ExpenseUpdationService,
        private expenseDeletationService: ExpenseDeletationService,
        private expenseNotificationService: ExpenseNotificationService) { }

    subscribeExpense(): Observable<Expense[]> {
        return this.expenses$.asObservable();
    }

    async getExpenseByDocumentId(documentId: string): Promise<Expense> {
        return this.expenseSearchingService.searchByDocumentId(documentId);
    }

    async searchExpense(criteria: ExpenseSearch): Promise<void> {
        const expenses = await this.expenseSearchingService.searchByCriteria(criteria);

        if (isEmptyList(expenses)) this.toastService.showSuccess('No data found.');
        this.expenses$.next(expenses);
    }

    clearExpense(): void {
        this.expenses$.next([]);
    }

    async viewExpense(expense: Expense): Promise<void> {
        const expenseFormValue = await this.expenseCommonService.getExpenseFormValueFromExpense(expense);
        const modalRef = this.modalService.open(ExpenseModalComponent, { centered: true, backdrop: 'static' });
        modalRef.componentInstance.action = Action.VIEW;
        modalRef.componentInstance.expense = expenseFormValue;
    }

    async addExpense(): Promise<void> {
        const modalRef = this.modalService.open(ExpenseModalComponent, { centered: true, backdrop: 'static' });
        modalRef.componentInstance.action = Action.CREATE;

        await modalRef.result.then(async (expense: Expense<Timestamp>) => {
            const created = await this.expenseCreationService.create(expense);
            await this.expenseNotificationService.pushNotification(created, Action.CREATE);
        }, err => { });
    }

    async editExpense(expense: Expense): Promise<void> {
        const expenseFormValue = await this.expenseCommonService.getExpenseFormValueFromExpense(expense);
        const modalRef = this.modalService.open(ExpenseModalComponent, { centered: true, backdrop: 'static' });
        modalRef.componentInstance.action = Action.UPDATE;
        modalRef.componentInstance.expense = expenseFormValue;

        await modalRef.result.then(async (expense: Expense) => {
            const updated = await this.expenseUpdationService.update(expense);
            this.expenses$.pipe(takeOnce()).subscribe(expenses =>
                this.expenses$.next(expenses.map(exp =>
                    exp.meta.documentId === updated.meta.documentId ? updated : exp)));
            await this.expenseNotificationService.pushNotification(updated, Action.UPDATE);
        }, err => { });
    }

    async deleteExpense(expense: Expense): Promise<void> {
        const confirmation = confirm('After confirm the content will be deleted from the system.');
        if (!confirmation) return;

        await this.expenseDeletationService.delete(expense);
        this.expenses$.pipe(takeOnce()).subscribe(expenses =>
            this.expenses$.next(expenses.filter(expense =>
                expense.meta.documentId !== expense.meta.documentId)));
        await this.expenseNotificationService.pushNotification(expense, Action.DELETE);
    }

    viewAttachment(attachmentUrl: string) {
        const modalRef = this.modalService.open(ImageViewerComponent, { centered: true });
        modalRef.componentInstance.imgUrl = attachmentUrl;
    }

}
