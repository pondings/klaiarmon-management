import { Injectable } from "@angular/core";
import { QueryFn } from "@angular/fire/compat/firestore";
import { filterByIgnoreCase, isNotNullOrUndefined } from "src/app/common/utils/common-util";
import { DataService } from "src/app/core/services/data-service";
import { RecurringExpense, RecurringExpenseSearchValue } from "../model/recurring-expense";
import { RecurringExpenseService } from "./recurring-expense.service";

@Injectable()
export class RecurringExpenseSearchService {

    constructor(private dataService: DataService) {}

    async search(searchValue: RecurringExpenseSearchValue): Promise<RecurringExpense[]> {
        console.log(searchValue);
        const criteria: QueryFn = (ref) => {
            let query: firebase.default.firestore.CollectionReference | firebase.default.firestore.Query = ref;
            if (searchValue.paidBy) query = query.where('paidBy', '==', searchValue.paidBy);
            if (isNotNullOrUndefined(searchValue.active)) query = query.where('active', '==', searchValue.active);
            return query;
        }
        let results = await this.dataService.getCollection<RecurringExpense>(RecurringExpenseService.RECURRING_EXPENSE_COLLECTION_PATH, 
            { showSpinner: true, query: criteria });
        if (searchValue.name) results = results.filter(filterByIgnoreCase('name', searchValue.name));
        
        return results;
    }

}
