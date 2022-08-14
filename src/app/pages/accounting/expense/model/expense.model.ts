import { MetaData } from "src/app/model/meta-data";
import {
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
    date: TDATE;
    paidBy: string;
    files: AttachmentUpload[];
    meta: MetaData<TDATE>;
    sharings: Sharing[]
}

export interface ExpenseForm {
    name: NullableStringFormControl;
    amount: NullableNumberFormControl;
    date: NullableDateStructFormControl;
    paidBy: NullableUserInfoFormControl;
    files: FormArray<FormGroup<AttachmentUploadForm>>;
    sharings: FormArray<FormGroup<SharingForm>>;
    meta: NullableMetaFormControl;
}

export interface Sharing {
    user: string,
    amount: number;
}

export interface SharingForm {
    user: NullableUserInfoFormControl,
    amount: NullableNumberFormControl
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
    file: NullableFile;
    attachmentUrl: NullableString;
    uploadDate?: NullableDate;
}

export interface AttachmentUploadForm {
    name: NullableStringFormControl,
    file: NullableFileFormControl,
    attachmentUrl: NullableStringFormControl,
    uploadDate?: NullableDateFormControl;
}
