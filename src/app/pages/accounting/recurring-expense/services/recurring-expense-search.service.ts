import { Injectable } from "@angular/core";
import { DataService } from "src/app/core/services/data-service";
import { RecurringExpense } from "../model/recurring-expense";
import { RecurringExpenseService } from "./recurring-expense.service";

@Injectable()
export class RecurringExpenseSearchService {

    constructor(private dataService: DataService) {}

    async search(): Promise<RecurringExpense[]> {
        return await this.dataService.getCollection<RecurringExpense>(RecurringExpenseService.RECURRING_EXPENSE_COLLECTION_PATH, 
            { showSpinner: true });
    }

}
