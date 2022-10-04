import { Injectable } from "@angular/core";
import { QueryFn } from "@angular/fire/compat/firestore";
import { filterByEqual, filterByIgnoreCase } from "src/app/common/utils/common-util";
import { DataService } from "src/app/core/services/data-service";
import { Expense, ExpenseSearch } from "../model/expense.model";
import { ExpenseService } from "./expense.service";

@Injectable()
export class ExpenseSearchingService {

    constructor(private dataService: DataService) {}

    async searchByCriteria(criteria: ExpenseSearch): Promise<Expense[]> {
        const criteriaQuery: QueryFn = (ref) => {
            let query: firebase.default.firestore.CollectionReference | firebase.default.firestore.Query = ref;
            if (criteria.startDate) query = query.where('date', '>=', criteria.startDate);
            if (criteria.endDate) query = query.where('date', '<=', criteria.endDate);
            return query.orderBy('date', 'desc');
        };

        let expenses = await this.dataService.getCollection<Expense>(ExpenseService.EXPENSE_COLLECTION_PATH, { showSpinner: true, query: criteriaQuery });
        if (criteria.name) expenses = expenses.filter(filterByIgnoreCase('name', criteria.name));
        if (criteria.paidBy) expenses = expenses.filter(filterByEqual('paidBy', criteria.paidBy));
        return expenses;
    }

    async searchByDocumentId(documentId: string): Promise<Expense> {
        return await this.dataService.getDocument<Expense>(`${ExpenseService.EXPENSE_COLLECTION_PATH}/${documentId}`);
    }

}
