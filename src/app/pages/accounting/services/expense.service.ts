import { Injectable } from "@angular/core";
import { DataService } from "src/app/core/services/data-service";
import { Expense } from "../model/expense.model";

@Injectable()
export class ExpenseService {

    private static readonly EXPENSE_COLLECTION_PATH = 'accounting/data/expense';

    constructor(private dataService: DataService) {}

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
