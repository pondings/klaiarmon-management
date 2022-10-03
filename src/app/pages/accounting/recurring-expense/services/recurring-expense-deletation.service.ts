import { Injectable } from "@angular/core";
import { DataService } from "src/app/core/services/data-service";
import { RecurringExpense } from "../model/recurring-expense";
import { RecurringExpenseService } from "./recurring-expense.service";

@Injectable()
export class RecurringExpenseDeletationService {

    constructor(private dataService: DataService) {}

    async delete(recurringExpense: RecurringExpense): Promise<boolean> {
        const confirmation = confirm('After confirm the content will be deleted from the system.');
        if (!confirmation) return false;
        
        await this.dataService.deleteDocument(RecurringExpenseService.RECURRING_EXPENSE_COLLECTION_PATH, recurringExpense.meta.documentId!, 
            { showSpinner: true, toastMessage: 'Recurring expense deleted' });
        return true;
    }

}