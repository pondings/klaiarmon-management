import { Injectable } from "@angular/core";
import { QueryFn } from "@angular/fire/compat/firestore";
import { DataService } from "src/app/core/services/data-service";
import { RecurringExpense, RecurringExpenseSearchValue } from "../model/recurring-expense";
import { RecurringExpenseService } from "./recurring-expense.service";

@Injectable()
export class RecurringExpenseSearchService {

    constructor(private dataService: DataService) {}

    async search(searchValue: RecurringExpenseSearchValue): Promise<RecurringExpense[]> {
        const criteria: QueryFn = (ref) => {
            let query: firebase.default.firestore.CollectionReference | firebase.default.firestore.Query = ref;
            if (searchValue.name) query = query.where('name', '==', searchValue.name);
            if (searchValue.paidBy) query = query.where('paidBy', '==', searchValue.paidBy);
            return query.orderBy('meta.createdDate', 'desc');
        }
        return await this.dataService.getCollection<RecurringExpense>(RecurringExpenseService.RECURRING_EXPENSE_COLLECTION_PATH, 
            { showSpinner: true, query: criteria });
    }

}
