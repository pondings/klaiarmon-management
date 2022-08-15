import { Injectable } from "@angular/core";
import { QueryFn } from "@angular/fire/compat/firestore";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Timestamp } from "firebase/firestore";
import { BehaviorSubject, Observable } from "rxjs";
import { Action } from "src/app/common/enum/action";
import { getDateStructFromDate } from "src/app/common/utils/date-struct.util";
import { getMoment } from "src/app/common/utils/moment.util";
import { takeOnce } from "src/app/common/utils/rxjs-util";
import { DataService } from "src/app/core/services/data-service";
import { FireAuthService } from "src/app/core/services/fire-auth.service";
import { FireStorageService } from "src/app/core/services/fire-storage.service";
import { ToastService } from "src/app/core/toast/toast.service";
import { ImageViewerComponent } from "src/app/shared/components/image-viewer/image-viewer.component";
import { ExpenseModalComponent } from "../components/expense-modal/expense-modal.component";
import { AttachmentUpload, Expense, ExpenseFormValue, ExpenseSearch } from "../model/expense.model";

@Injectable()
export class ExpenseService {

    static readonly EXPENSE_COLLECTION_PATH = 'accounting/expense/data';

    private expenses$ = new BehaviorSubject<Expense[]>([]);

    constructor(private dataService: DataService,
        private fireStorageService: FireStorageService,
        private fireAuthService: FireAuthService,
        private toastService: ToastService,
        private modalService: NgbModal) { }

    async addExpense(): Promise<void> {
        const modalRef = this.modalService.open(ExpenseModalComponent, { centered: true });
        modalRef.componentInstance.action = Action.CREATE;

        await modalRef.result.then(async (expense: Expense<Timestamp>) => {
            expense.files = await Promise.all(expense.files.map(async file => await this.uploadFile(file)));
            await this.dataService.addDocument(ExpenseService.EXPENSE_COLLECTION_PATH, expense,
                { showSpinner: true, toastMessage: 'Expense added' });
        }, err => { });
    }

    async editExpense(expense: Expense): Promise<void> {
        const expenseFormValue = await this.getExpenseFormValueFromExpense(expense);
        const modalRef = this.modalService.open(ExpenseModalComponent, { centered: true });
        modalRef.componentInstance.action = Action.UPDATE;
        modalRef.componentInstance.expense = expenseFormValue;

        await modalRef.result.then(async (expense: Expense) => {
            expense.files = await Promise.all(expense.files.map(async file => file.file ? await this.uploadFile(file) : file));
            expense.date = Timestamp.fromDate(expense.date as any);
            const updatedData = await this.dataService.updateDocument(ExpenseService.EXPENSE_COLLECTION_PATH, expense, 
                { showSpinner: true, toastMessage: 'Expense updated' });
            this.expenses$.pipe(takeOnce()).subscribe(expenses => 
                this.expenses$.next(expenses.map(exp => 
                    exp.meta.documentId === updatedData.meta.documentId ? updatedData : exp)));
        }, err => { });
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

        if (!collection || !collection[0]) this.toastService.showSuccess('No data found.');
        this.expenses$.next(collection);
    }

    clearExpense(): void {
        this.expenses$.next([]);
    }

    async deleteExpense(documentId: string): Promise<void> {
        const confirmation = confirm('After confirm the content will be deleted from the system.');
        if (!confirmation) return;

        await this.dataService.deleteDocument(ExpenseService.EXPENSE_COLLECTION_PATH, documentId, 
            { showSpinner: true, toastMessage: 'Expense deleted' });
        this.expenses$.pipe(takeOnce()).subscribe(expenses => 
            this.expenses$.next(expenses.filter(expense => 
                expense.meta.documentId !== documentId)));
    }

    viewAttachment(attachmentUrl: string) {
        const modalRef = this.modalService.open(ImageViewerComponent, { centered: true });
        modalRef.componentInstance.imgUrl = attachmentUrl;
    }

    private async uploadFile(file: AttachmentUpload): Promise<AttachmentUpload> {
        const currentDate = getMoment(),
            year = currentDate?.year(),
            month = currentDate?.month()! + 1;
        const fileName = file.name?.toLowerCase().replace(/\s|\//g, '');

        const path = `expense/${year}/${month}/${fileName}-${currentDate?.format('DD-MM-YYYY-HH-mm-ss')}`;
        const uploadUrl = await this.fireStorageService.uploadFile(path, file.file!);
        return { name: fileName!, attachmentUrl: uploadUrl, uploadDate: currentDate?.toDate() };
    }

    private filterExpenseByName(name: string): (expense: Expense) => boolean {
        return (expenses: Expense) => expenses.name.toLowerCase().includes(name.toLowerCase());
    }

    private filterExpenseByPaidBy(paidBy: string): (expense: Expense) => boolean {
        return (expense: Expense) => expense.paidBy === paidBy;
    }

    private async getExpenseFormValueFromExpense(expense: Expense): Promise<ExpenseFormValue> {
        const { name, amount, date: _date, paidBy: _paidBy, files, meta, billings: _billings } = expense;
        const date = getDateStructFromDate(_date.toDate());
        const paidBy = await this.fireAuthService.getUserByUid(expense.paidBy);
        const billings = await Promise.all(_billings.map(async billing => 
            ({ user: await this.fireAuthService.getUserByUid(billing.user), amount: billing.amount })));

        return { name, amount, date, paidBy, files, meta, billings }
    }

}
