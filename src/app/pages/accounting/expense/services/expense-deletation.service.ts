import { Injectable } from "@angular/core";
import { DataService } from "src/app/core/services/data-service";
import { Expense } from "../model/expense.model";
import { ExpenseService } from "./expense.service";

@Injectable()
export class ExpenseDeletationService {

    constructor(private dataService: DataService) {}

    async delete(expense: Expense): Promise<void> {
        await this.dataService.deleteDocument(ExpenseService.EXPENSE_COLLECTION_PATH, expense.meta.documentId!,
            { showSpinner: true, toastMessage: 'Expense deleted' });
    }

}