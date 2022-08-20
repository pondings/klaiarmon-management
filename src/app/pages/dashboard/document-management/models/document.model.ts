import { FormControl } from "@angular/forms";
import { NullableDateStructFormControl, NullableStringFormControl, NullableUserInfoFormControl } from "src/app/common/types/common.type";
import { MetaData } from "src/app/model/meta-data";

export interface Document {
    name: string;
    url: string;
    path: string;
    meta: MetaData;
    type: string;
}

export interface DocumentDto {
    name: string;
    url?: string;
    file?: File;
    meta: MetaData;
    path: string;
    type: string;
}

export interface DocumentSearch {
    name: string;
    uploadBy: string;
    startDate: Date;
    endDate: Date;
}

export interface DocumentSearchForm {
    name: NullableStringFormControl;
    uploadBy: NullableUserInfoFormControl;
    startDate: NullableDateStructFormControl;
    endDate: NullableDateStructFormControl;
}
