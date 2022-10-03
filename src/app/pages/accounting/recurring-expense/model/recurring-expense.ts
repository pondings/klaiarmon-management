import { FormArray, FormGroup } from "@angular/forms";
import { Timestamp } from "firebase/firestore";
import { NullableBoolean, NullableBooleanFormControl, NullableDateStructFormControl, NullableMeta, NullableMetaFormControl, NullableNumber, NullableNumberFormControl, NullableString, NullableStringFormControl, NullableUserInfoFormControl } from "src/app/common/types/common.type";
import { NullableDateStruct } from "src/app/common/utils/date-struct.util";
import { MetaData } from "src/app/model/meta-data";
import { Billing, BillingForm, BillingFormValue } from "../../expense/model/expense.model";

export interface RecurringExpense<TDATE = Timestamp> {
    name: string;
    every: number;
    paidBy: string;
    amount?: number;
    period?: number;
    meta: MetaData<TDATE>;
    billings: Billing[];
    active: boolean;
    recurringEnd: TDATE;
}

export interface RecurringExpenseForm {
    name: NullableStringFormControl;
    every: NullableNumberFormControl;
    paidBy: NullableUserInfoFormControl;
    amount: NullableNumberFormControl;
    period: NullableNumberFormControl;
    meta: NullableMetaFormControl;
    billings: FormArray<FormGroup<BillingForm>>;
    active: NullableBooleanFormControl;
    recurringEnd: NullableDateStructFormControl;
}

export interface RecurringExpenseFormValue {
    name: NullableString;
    every: NullableNumber;
    paidBy: NullableString;
    amount: NullableNumber;
    period: NullableNumber;
    meta: NullableMeta;
    billings: BillingFormValue[];
    active: NullableBoolean;
    recurringEnd: NullableDateStruct
}
