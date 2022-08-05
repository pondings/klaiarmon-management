import { Timestamp } from '@firebase/firestore-types';

export interface MetaData {
    documentId?: string;
    createdBy?: string;
    createdDate?: Date;
    updatedBy?: string;
    updatedDate?: Date;
}

export interface RawMetaData {
    documentId?: string;
    createdBy?: string;
    createdDate?: Timestamp;
    updatedBy?: string;
    updatedDate?: Timestamp;
}

export type HasRawMetaData<T> = T & { meta: RawMetaData };
export type HasMetaData<T> = T & { meta: MetaData };
export type HasRawMetaWithoutId<T> = T & {  meta: Omit<RawMetaData, 'documentId'> };
