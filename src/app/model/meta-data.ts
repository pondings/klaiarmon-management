import { Timestamp } from '@firebase/firestore-types';
import { ToastService } from '../core/toast/toast.service';

export interface MetaData<TDate = Timestamp> {
    documentId?: string;
    createdBy?: string;
    createdDate?: TDate;
    updatedBy?: string;
    updatedDate?: TDate;
}

export interface TransactionsSuccess<T> {
    data: HasMetaData<T>[];
    toast: ToastService;
}

export type HasMetaData<T> = T & { meta: MetaData, _documentId?: string };
