import { Timestamp } from "firebase/firestore";
import { MetaData } from "src/app/model/meta-data";

export interface Expense {
    name: string;
    amount: number;
    date: Timestamp;
    documents: string[];
    meta: MetaData;
}

export interface ExpenseDto {
    name: string;
    amount: number;
    date: Date;
    documents: string[];
    meta: MetaData<Date>
}
