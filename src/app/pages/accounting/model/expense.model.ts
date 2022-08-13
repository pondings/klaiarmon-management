import { FormControl } from "@angular/forms";
import { Nullable } from "src/app/common/types/common.type";
import { MetaData } from "src/app/model/meta-data";

export interface Expense<TDATE = Date> {
    name: string;
    amount: number;
    isPersonalDebt: boolean;
    date: TDATE;
    paidBy: string;
    documents: string[];
    meta: MetaData<TDATE>;
}

export interface ExpenseForm {
    name: FormControl<Nullable<string>>;
    amount: FormControl<Nullable<number>>;
    isPersonalDebt: FormControl<Nullable<boolean>>;
    date: FormControl<Nullable<Date>>;
    paidBy: FormControl<Nullable<string>>;
}

export interface ExpenseSearchForm {
    name: FormControl<Nullable<string>>;
    date: FormControl<Nullable<Date>>;
}
