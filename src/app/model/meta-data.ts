import { Timestamp } from '@firebase/firestore-types';

export interface MetaData {
    documentId?: string;
    createdBy?: string;
    createdDate?: Timestamp;
    updatedBy?: string;
    updatedDate?: Timestamp;
}

export type HasMetaData<T> = T & { meta: MetaData, _documentId?: string };
