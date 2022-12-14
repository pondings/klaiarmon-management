import { MetaData } from "src/app/model/meta-data";
import {
    NullableDateFormControl,
    NullableDateStructFormControl,
    NullableFile,
    NullableFileFormControl,
    NullableMeta,
    NullableMetaFormControl,
    NullableNumber,
    NullableNumberFormControl,
    NullableString,
    NullableStringFormControl,
    NullableUserInfo,
    NullableUserInfoFormControl
} from "src/app/common/types/common.type";
import { FormArray, FormGroup } from "@angular/forms";
import { NullableDate } from "src/app/common/utils/date.util";
import { Timestamp } from "firebase/firestore";
import { NullableDateStruct } from "src/app/common/utils/date-struct.util";

export interface Expense<TDATE = Timestamp> {
    name: string;
    amount: number;
    date: TDATE;
    paidBy: string;
    files: AttachmentUpload[];
    meta: MetaData<TDATE>;
    billings: Billing[];
    status: string;
}

export interface ExpenseForm {
    name: NullableStringFormControl;
    amount: NullableNumberFormControl;
    date: NullableDateStructFormControl;
    paidBy: NullableUserInfoFormControl;
    files: FormArray<FormGroup<AttachmentUploadForm>>;
    billings: FormArray<FormGroup<BillingForm>>;
    meta: NullableMetaFormControl;
}

export interface ExpenseFormValue {
    name: NullableString;
    amount: NullableNumber;
    date: NullableDateStruct;
    paidBy: NullableUserInfo;
    files: AttachmentUpload[];
    billings: BillingFormValue[];
    meta: NullableMeta;
}

export interface Billing {
    user: string,
    amount: number;
}

export interface BillingForm {
    user: NullableUserInfoFormControl,
    amount: NullableNumberFormControl
}

export interface BillingFormValue {
    user: NullableUserInfo;
    amount: NullableNumber;
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

export interface AttachmentUpload {
    name: NullableString;
    file?: NullableFile;
    attachmentUrl: NullableString;
    uploadDate?: NullableDate;
}

export interface AttachmentUploadForm {
    name: NullableStringFormControl,
    file: NullableFileFormControl,
    attachmentUrl: NullableStringFormControl,
    uploadDate?: NullableDateFormControl;
}
