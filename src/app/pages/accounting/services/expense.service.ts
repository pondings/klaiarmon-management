import { Injectable } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { DataService } from "src/app/core/services/data-service";
import { ExpenseModalComponent } from "../components/expense-modal/expense-modal.component";
import { Expense } from "../model/expense.model";

@Injectable()
export class ExpenseService {

    private static readonly EXPENSE_COLLECTION_PATH = 'accounting/transaction/expense';

    constructor(private dataService: DataService,
        private modalService: NgbModal) {}

    async openAddExpenseModal(): Promise<void> {
        const modalRef = this.modalService.open(ExpenseModalComponent, { centered: true });

        await modalRef.result.then(data => {}, err => {});
    }

    addExpense(expense: Expense): void {
    }

    getExpense(): Expense[] {
        return [];
    }

    updateExpense(expense: Expense): Expense {
        return expense;
    }

    deleteExpense(): void {
    }

}
