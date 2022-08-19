import { FormControlStatus } from "@angular/forms";
import { map, OperatorFunction } from "rxjs";

export const isFormStatusEqual = (expectStatus: FormControlStatus): OperatorFunction<FormControlStatus, boolean> => 
    status$ => status$.pipe(map(_isFormStatusEqual(expectStatus)));

export const isFormValid: OperatorFunction<FormControlStatus, boolean> = isFormStatusEqual('VALID');
export const isFormDisabled: OperatorFunction<FormControlStatus, boolean> = isFormStatusEqual('DISABLED');

const _isFormStatusEqual = (expect: FormControlStatus): (formStatus: FormControlStatus) => boolean => 
    formStatus => formStatus === expect;