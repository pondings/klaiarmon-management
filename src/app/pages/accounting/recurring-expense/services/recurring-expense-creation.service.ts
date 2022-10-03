import { Injectable } from "@angular/core";
import { Timestamp } from "firebase/firestore";
import { Nullable } from "src/app/common/types/common.type";
import { DataService } from "src/app/core/services/data-service";
import { RecurringExpense } from "../model/recurring-expense";
import { RecurringExpenseService } from "./recurring-expense.service";
import * as moment from 'moment';

@Injectable()
export class RecurringExpenseCreationService {

    constructor(private dataService: DataService) {}

    async create(recurringExpense: RecurringExpense): Promise<void> {
        recurringExpense.active = true;
        recurringExpense.recurringStart = this.calculateRecurringStart(recurringExpense)!;
        recurringExpense.recurringEnd = this.calculateRecurringEnd(recurringExpense)!;
        await this.dataService.addDocument(RecurringExpenseService.RECURRING_EXPENSE_COLLECTION_PATH, recurringExpense,
            { showSpinner: true, toastMessage: 'Recurring Expense added' });
    }

    private calculateRecurringStart(recurringExpense: RecurringExpense): Nullable<Timestamp> {
        if (!recurringExpense.period) return null;
        const today = moment();
        const day = today.date();
        let month = today.month() + 1;
        const year = today.year();

        if (recurringExpense.every < day) month += 1;
        const recurringStartDate = moment(`${year}/${month}/${recurringExpense.every}`);
        return Timestamp.fromDate(recurringStartDate.toDate());
    }

    private calculateRecurringEnd(recurringExpense: RecurringExpense): Nullable<Timestamp> {
        if (!recurringExpense.period) return null;

        const recurringEndDate = moment(recurringExpense.recurringStart.toDate())
            .add(recurringExpense.period - 1, "months")
            .toDate();
        return Timestamp.fromDate(recurringEndDate);
    }

}