import { QueryFn } from "@angular/fire/compat/firestore";

export interface DataServiceOptions {
    showSpinner?: boolean;
    toastMessage?: string;
    query?: QueryFn;
}
