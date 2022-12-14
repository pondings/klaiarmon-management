import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { map, Observable } from "rxjs";

import * as firestoreUtils from 'src/app/common/utils/firestore.util';
import { QueryFn } from "@angular/fire/compat/firestore";
import { takeOnce } from "src/app/common/utils/rxjs-util";

@Injectable({ providedIn: 'root' })
export class FirestoreService {

    static readonly DOCUMENT_ID_KEY = '_documentId';

    constructor(private angularFirestore: AngularFirestore) { }

    subscribeCollection<T>(path: string, query?: QueryFn): Observable<T[]> {
        return this.angularFirestore.collection<T>(path, query).valueChanges({ idField: FirestoreService.DOCUMENT_ID_KEY });
    }

    getCollection<T>(path: string, query?: QueryFn): Observable<T[]> {
        return this.angularFirestore.collection<T>(path, query).valueChanges({ idField: FirestoreService.DOCUMENT_ID_KEY })
            .pipe(takeOnce());
    }

    subscribeDocument<T>(path: string): Observable<T | undefined> {
        return this.angularFirestore.doc<T>(path).valueChanges();
    }

    getDocument<T>(path: string): Observable<T> {
        return this.angularFirestore.doc<T>(path).valueChanges()
            .pipe(map(data => data!), takeOnce());
    }

    async updateDocument<T>(path: string, data: T): Promise<T> {
        const cleanData = firestoreUtils.cleanData(data);
        const doc = this.angularFirestore.doc<T>(path);
        await doc.update(data);
        return cleanData;
    }

    async updateDocuments<T>(path: string, dataList: T[]): Promise<T[]> {
        const batch = this.angularFirestore.firestore.batch();

        const cleanedData = dataList.map(firestoreUtils.cleanData);
        cleanedData.forEach(data => {
            const doc = this.angularFirestore.firestore.doc(path);
            batch.update(doc, data);
        });

        await batch.commit();
        return cleanedData;
    }

    async deleteDocument(path: string): Promise<void> {
        const doc = this.angularFirestore.doc(path);
        await doc.delete();
    }

    async addDocument<T>(path: string, data: T): Promise<T> {
        const cleanData = firestoreUtils.cleanData(data);
        const collection = this.angularFirestore.collection<T>(path);
        const addedDocument = await collection.add(data);

        cleanData.meta.documentId = addedDocument.id;
        return cleanData;
    }

}
