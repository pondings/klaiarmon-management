import { Injectable } from "@angular/core";
import { QueryFn } from "@angular/fire/compat/firestore";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Timestamp } from "firebase/firestore";
import { BehaviorSubject, map, Observable, OperatorFunction } from "rxjs";
import { getMoment } from "src/app/common/utils/moment.util";
import { takeOnce } from "src/app/common/utils/rxjs-util";
import { DataService } from "src/app/core/services/data-service";
import { FireStorageService } from "src/app/core/services/fire-storage.service";
import { ImageViewerComponent } from "src/app/shared/components/image-viewer/image-viewer.component";
import { ExpenseModalComponent } from "../components/expense-modal/expense-modal.component";
import { Expense, ExpenseSearch } from "../model/expense.model";

@Injectable()
export class ExpenseService {

    private static readonly EXPENSE_COLLECTION_PATH = 'accounting/expense/data';

    private expenses$ = new BehaviorSubject<Expense[]>([]);

    constructor(private dataService: DataService,
        private fireStorageService: FireStorageService,
        private modalService: NgbModal) { }

    async openAddExpenseModal(): Promise<void> {
        const modalRef = this.modalService.open(ExpenseModalComponent, { centered: true });

        await modalRef.result.then(async (expense: Expense<Timestamp>) => {
            const currentDate = getMoment(),
                year = currentDate?.year(),
                month = currentDate?.month()! + 1,
                day = currentDate?.day();

            expense.files = await Promise.all(expense.files.map(async file => {
                const path = `expense/${year}/${month}/${file.name}-${currentDate?.format('DD-MM-YYYY-HH-mm-ss')}.${file.file?.type}`;
                const uploadUrl = await this.fireStorageService.uploadFile(path, file.file!);
                return { ...file, photoUrl: uploadUrl, file: null };
            }))

            await this.dataService.addDocument(ExpenseService.EXPENSE_COLLECTION_PATH, expense,
                { showSpinner: true, toastMessage: 'Expense added' });
        }, err => { });
    }

    addExpense(expense: Expense): void {
    }

    getExpense(): Observable<Expense[]> {
        return this.expenses$.asObservable();
    }

    searchExpense(criteria: ExpenseSearch): void {
        const criteriaQuery: QueryFn = (ref) => {
            let query: firebase.default.firestore.CollectionReference | firebase.default.firestore.Query = ref;
            if (criteria.startDate) query = query.where('date', '>=', criteria.startDate);
            if (criteria.endDate) query = query.where('date', '<=', criteria.endDate);
            return query.orderBy('date', 'desc');
        };

        let collection = this.dataService.getCollection<Expense>(ExpenseService.EXPENSE_COLLECTION_PATH, { showSpinner: true, query: criteriaQuery });
        if (criteria.name) collection = collection.pipe(this.filterExpenseByName(criteria.name));
        if (criteria.paidBy) collection = collection.pipe(this.filterExpenseByPaidBy(criteria.paidBy));
        collection.pipe(takeOnce()).subscribe(expenses => this.expenses$.next(expenses));
    }

    updateExpense(expense: Expense): Expense {
        return expense;
    }

    deleteExpense(): void {
    }

    viewPhoto(photoUrl: string) {
        const modalRef = this.modalService.open(ImageViewerComponent, { centered: true });
        modalRef.componentInstance.imgUrl = photoUrl;
    }

    private filterExpenseByName(name: string): OperatorFunction<Expense[], Expense[]> {
        return expenses$ => expenses$.pipe(map(expenses =>
            expenses.filter(expense =>
                expense.name.toLowerCase().includes(name.toLowerCase()))));
    }

    private filterExpenseByPaidBy(paidBy: string): OperatorFunction<Expense[], Expense[]> {
        return expenses$ => expenses$.pipe(map(expenses =>
            expenses.filter(expense =>
                expense.paidBy === paidBy)));
    }


}
