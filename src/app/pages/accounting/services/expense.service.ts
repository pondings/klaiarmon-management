import { Injectable } from "@angular/core";
import { AngularFireStorage } from "@angular/fire/compat/storage";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Timestamp } from "firebase/firestore";
import { finalize, take } from "rxjs";
import { getMoment } from "src/app/common/utils/moment.util";
import { takeOnce } from "src/app/common/utils/rxjs-util";
import { DataService } from "src/app/core/services/data-service";
import { FireStorageService } from "src/app/core/services/fire-storage.service";
import { ExpenseModalComponent } from "../components/expense-modal/expense-modal.component";
import { Expense } from "../model/expense.model";

@Injectable()
export class ExpenseService {

    private static readonly EXPENSE_COLLECTION_PATH = 'accounting/transaction/expense';

    constructor(private dataService: DataService,
        private fireStorageService: FireStorageService,
        private modalService: NgbModal) {}

    async openAddExpenseModal(): Promise<void> {
        const modalRef = this.modalService.open(ExpenseModalComponent, { centered: true });

        await modalRef.result.then(async (expense: Expense<Timestamp>) => {
            const currentDate = getMoment(),
                year = currentDate?.year(),
                month = currentDate?.month()! + 1,
                day = currentDate?.day();

            expense.files = await Promise.all(expense.files.map(async file => {
                const path = `expense/${year}/${month}/${file.name}-${currentDate?.format('DD-MM-YYYY-HH-mm-ss')}`;
                const uploadUrl = await this.fireStorageService.uploadFile(path, file.file!);
                return { ...file, photoUrl: uploadUrl, file: null };
            }))

            await this.dataService.addDocument(ExpenseService.EXPENSE_COLLECTION_PATH, expense, 
                { showSpinner: true, toastMessage: 'Expense added' });
        }, err => {});
    }

    addExpense(expense: Expense): void {
    }

    getExpense(): Expense[] {
        return [];
    }

    updateExpense(expense: Expense): Expense {
        return expense;
    }

    deleteExpense(): void {
    }

}
