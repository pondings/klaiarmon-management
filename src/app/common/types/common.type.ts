import { FormControl } from "@angular/forms";
import { UserInfo } from "src/app/core/services/fire-auth.service";
import { MetaData } from "src/app/model/meta-data";
import { NullableDateStruct } from "../utils/date-struct.util";
import { NullableDate } from "../utils/date.util";

export type Nullable<T> = T | null;
export type ForkArrays<T> = [T[], T[]];

export type NullableString = Nullable<string>;
export type NullableNumber = Nullable<number>;
export type NullableBoolean = Nullable<boolean>;
export type NullableFile = Nullable<File>;
export type NullableUserInfo = Nullable<Partial<UserInfo>>;
export type NullableMeta = Nullable<MetaData>;

export type NullableStringFormControl = FormControl<NullableString>;
export type NullableNumberFormControl = FormControl<NullableNumber>;
export type NullableBooleanFormControl = FormControl<NullableBoolean>;
export type NullableDateStructFormControl = FormControl<NullableDateStruct>;
export type NullableUserInfoFormControl = FormControl<NullableUserInfo>;
export type NullableFileFormControl = FormControl<NullableFile>;
export type NullableMetaFormControl = FormControl<NullableMeta>;
export type NullableDateFormControl = FormControl<NullableDate>;
