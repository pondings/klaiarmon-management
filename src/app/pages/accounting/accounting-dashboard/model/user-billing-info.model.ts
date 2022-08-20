import { Expense } from "../../expense/model/expense.model";

export enum PaymentAction {
    PAY = 'Pay to', RECEIVE = 'Receive from', NOTHING = 'Nothing with'
}

export interface BillingResult {
    user: string;
    paymentAction?: PaymentAction,
    amount: number;
}

export interface BillingItem {
    documentId: string;
    name: string;
    amount: number;
}

export interface BillingInfo {
    user: string;
    amount: number;
    items: BillingItem[];
}

export interface UserBillingInfo {
    user: string;
    expenses: Expense[];
    debtors: BillingInfo[];
    creditors: BillingInfo[];
    results: BillingResult[];
    expenseAmount: number;
}
