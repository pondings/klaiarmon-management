import { Injectable } from "@angular/core";
import { QueryFn } from "@angular/fire/compat/firestore";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Timestamp } from "firebase/firestore";
import { BehaviorSubject, Observable } from "rxjs";
import { getMoment } from "src/app/common/utils/moment.util";
import { DataService } from "src/app/core/services/data-service";
import { FireStorageService } from "src/app/core/services/fire-storage.service";
import { ImageViewerComponent } from "src/app/shared/components/image-viewer/image-viewer.component";
import { ExpenseModalComponent } from "../components/expense-modal/expense-modal.component";
import { Expense, ExpenseSearch } from "../model/expense.model";

@Injectable()
export class ExpenseService {

    private static readonly EXPENSE_COLLECTION_PATH = 'accounting/expense/data';
    private static readonly PONDTONG_SHARING_SETTING_DOCUMENT_PATH = 'accounting/expense/sharing-setting/pondtong';

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

    async searchExpense(criteria: ExpenseSearch): Promise<void> {
        const criteriaQuery: QueryFn = (ref) => {
            let query: firebase.default.firestore.CollectionReference | firebase.default.firestore.Query = ref;
            if (criteria.startDate) query = query.where('date', '>=', criteria.startDate);
            if (criteria.endDate) query = query.where('date', '<=', criteria.endDate);
            return query.orderBy('date', 'desc');
        };

        let collection = await this.dataService.getCollection<Expense>(ExpenseService.EXPENSE_COLLECTION_PATH, { showSpinner: true, query: criteriaQuery });
        if (criteria.name) collection = collection.filter(this.filterExpenseByName(criteria.name));
        if (criteria.paidBy) collection = collection.filter(this.filterExpenseByPaidBy(criteria.paidBy));
        this.expenses$.next(collection);
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

    getSharingSetting(): void {
        this.dataService.getDocument(ExpenseService.PONDTONG_SHARING_SETTING_DOCUMENT_PATH);
    }

    private filterExpenseByName(name: string): (expense: Expense) => boolean {
        return (expenses: Expense) => expenses.name.toLowerCase().includes(name.toLowerCase());
    }

    private filterExpenseByPaidBy(paidBy: string): (expense: Expense) => boolean {
        return (expense: Expense) => expense.paidBy === paidBy;
    }

}
