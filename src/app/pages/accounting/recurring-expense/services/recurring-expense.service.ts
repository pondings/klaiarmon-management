import { Injectable } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { BehaviorSubject, Observable } from "rxjs";
import { Action } from "src/app/common/enum/action";
import { RecurringExpenseModalComponent } from "../components/recurring-expense-modal/recurring-expense-modal.component";
import { RecurringExpense, RecurringExpenseSearchValue } from "../model/recurring-expense";
import { RecurringExpenseCreationService } from "./recurring-expense-creation.service";
import { RecurringExpenseSearchService } from "./recurring-expense-search.service";

@Injectable()
export class RecurringExpenseService {

    public static readonly RECURRING_EXPENSE_COLLECTION_PATH = 'accounting/expense/recurring';
    
    recurringExpenses$ = new BehaviorSubject<RecurringExpense[]>([]);

    constructor(private modalService: NgbModal,
        private recurringExpenseCreationService: RecurringExpenseCreationService,
        private recurringExpenseSearchService: RecurringExpenseSearchService) {}

    subscribeRecurringExpense(): Observable<RecurringExpense[]> {
        return this.recurringExpenses$.asObservable();
    }

    async addRecurringExpense(): Promise<void> {
        const modalRef = this.modalService.open(RecurringExpenseModalComponent, { centered: true, backdrop: 'static' });
        modalRef.componentInstance.action = Action.CREATE;

        await modalRef.result.then(async (recurringExpense: RecurringExpense) => {
            await this.recurringExpenseCreationService.create(recurringExpense);
        }, err => { });
    }

    async searchRecurringExpense(recurringExpenseSearchValue: RecurringExpenseSearchValue): Promise<void> {
        const recurringExpenses = await this.recurringExpenseSearchService.search();
        this.recurringExpenses$.next(recurringExpenses);
    }

    resetRecurringExpense(): void {
        this.recurringExpenses$.next([]);
    }

}
