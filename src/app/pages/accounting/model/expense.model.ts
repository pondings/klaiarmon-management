import { MetaData } from "src/app/model/meta-data";
import {
    NullableBooleanFormControl,
    NullableDateFormControl,
    NullableDateStructFormControl,
    NullableFile,
    NullableFileFormControl,
    NullableMetaFormControl,
    NullableNumberFormControl,
    NullableString,
    NullableStringFormControl,
    NullableUserInfoFormControl
} from "src/app/common/types/common.type";
import { FormArray, FormGroup } from "@angular/forms";
import { NullableDate } from "src/app/common/utils/date.util";
import { Timestamp } from "firebase/firestore";

export interface Expense<TDATE = Timestamp> {
    name: string;
    amount: number;
    isPersonalDebt: boolean;
    date: TDATE;
    paidBy: string;
    files: PhotoUpload[],
    meta: MetaData<TDATE>;
}

export interface ExpenseForm {
    name: NullableStringFormControl;
    amount: NullableNumberFormControl;
    date: NullableDateStructFormControl;
    paidBy: NullableUserInfoFormControl;
    isPersonalDebt: NullableBooleanFormControl;
    files: FormArray<FormGroup<PhotoUploadForm>>;
    meta: NullableMetaFormControl
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

export interface PhotoUpload {
    name: NullableString;
    file: NullableFile;
    photoUrl: NullableString;
    uploadDate?: NullableDate;
}

export interface PhotoUploadForm {
    name: NullableStringFormControl,
    file: NullableFileFormControl,
    photoUrl: NullableStringFormControl,
    uploadDate?: NullableDateFormControl;
}
