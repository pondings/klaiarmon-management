import { Injectable } from "@angular/core";
import { DataService } from "src/app/core/services/data-service";
import { Expense } from "../model/expense.model";
import { ExpenseCommonService } from "./expense-common.service";
import { ExpenseService } from "./expense.service";

@Injectable()
export class ExpenseUpdationService {

    constructor(private dataService: DataService,
        private expenseCommonService: ExpenseCommonService) {}

    async update(expense: Expense): Promise<Expense> {
        expense.files = await Promise.all(expense.files.map(async file => file.file ? await this.expenseCommonService.uploadFile(file) : file));
        return await this.dataService.updateDocument(ExpenseService.EXPENSE_COLLECTION_PATH, expense, 
            { showSpinner: true, toastMessage: 'Expense updated' });
    }

}
