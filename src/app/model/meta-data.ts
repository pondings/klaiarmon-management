import { Timestamp } from '@firebase/firestore-types';
import { ToastService } from '../core/toast/toast.service';

export interface MetaData {
    documentId?: string;
    createdBy?: string;
    createdDate?: Timestamp;
    updatedBy?: string;
    updatedDate?: Timestamp;
}

export interface TransactionsSuccess<T> {
    data: HasMetaData<T>[];
    toast: ToastService;
}

export type HasMetaData<T> = T & { meta: MetaData, _documentId?: string };
