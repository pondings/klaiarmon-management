import { MetaData } from "src/app/model/meta-data";
import {
    NullableBooleanFormControl,
    NullableDateStructFormControl,
    NullableFileFormControl,
    NullableNumberFormControl,
    NullableStringFormControl,
    NullableUserInfoFormControl
} from "src/app/common/types/common.type";
import { FormArray, FormControl, FormGroup } from "@angular/forms";

export interface Expense<TDATE = Date> {
    name: string;
    amount: number;
    isPersonalDebt: boolean;
    date: TDATE;
    paidBy: string;
    documents: string[];
    meta: MetaData<TDATE>;
}

export interface ExpenseAddForm {
    name: NullableStringFormControl;
    amount: NullableNumberFormControl;
    date: NullableDateStructFormControl;
    paidBy: NullableUserInfoFormControl;
    isPersonalDebt: NullableBooleanFormControl;
    files: FormArray<FormGroup<PhotoUploadForm>>
}

export interface ExpenseSearch {
    name: string;
    paidBy: string;
    startDate: Date;
    endDate: Date;
}

export interface ExpenseSearchForm {
    name: NullableStringFormControl;
    paidBy: NullableUserInfoFormControl;
    startDate: NullableDateStructFormControl;
    endDate: NullableDateStructFormControl;
}

export interface PhotoUploadForm {
    name: NullableStringFormControl,
    file: NullableFileFormControl,
    photoUrl: NullableStringFormControl
}
