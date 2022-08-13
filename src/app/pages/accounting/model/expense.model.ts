import { FormControl } from "@angular/forms";
import { Nullable } from "src/app/common/types/common.type";
import { NullableDateStruct } from "src/app/common/utils/date-struct.util";
import { UserInfo } from "src/app/core/services/fire-auth.service";
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

export interface ExpenseSearch {
    name: string;
    paidBy: string;
    startDate: Date;
    endDate: Date;
}

export interface ExpenseSearchForm {
    name: FormControl<Nullable<string>>;
    paidBy: FormControl<Nullable<Partial<UserInfo>>>;
    startDate: FormControl<NullableDateStruct>;
    endDate: FormControl<NullableDateStruct>;
}
