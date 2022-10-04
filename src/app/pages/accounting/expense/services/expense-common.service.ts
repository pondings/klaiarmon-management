import { Injectable } from "@angular/core";
import { getDateStructFromDate } from "src/app/common/utils/date-struct.util";
import { getMoment } from "src/app/common/utils/moment.util";
import { FireAuthService } from "src/app/core/services/fire-auth.service";
import { FireStorageService } from "src/app/core/services/fire-storage.service";
import { SpinnerService } from "src/app/core/spinner/spinner.service";
import { AttachmentUpload, Expense, ExpenseFormValue } from "../model/expense.model";

@Injectable()
export class ExpenseCommonService {

    constructor(private spinnerService: SpinnerService,
        private fireAuthService: FireAuthService,
        private fireStorageService: FireStorageService) {}
    
    async getExpenseFormValueFromExpense(expense: Expense): Promise<ExpenseFormValue> {
        this.spinnerService.show();
        const { name, amount, date: _date, paidBy: _paidBy, files, meta, billings: _billings } = expense;
        const date = getDateStructFromDate(_date.toDate());
        const paidBy = await this.fireAuthService.getUserByUid(expense.paidBy);
        const billings = await Promise.all(_billings.map(async billing =>
            ({ user: await this.fireAuthService.getUserByUid(billing.user), amount: billing.amount })));

        this.spinnerService.hide();
        return { name, amount, date, paidBy, files, meta, billings }
    }

    async uploadFile(file: AttachmentUpload): Promise<AttachmentUpload> {
        const currentDate = getMoment(),
            year = currentDate?.year(),
            month = currentDate?.month()! + 1;
        const fileName = file.name?.toLowerCase().replace(/\s|\//g, '');

        const path = `expense/${year}/${month}/${fileName}-${currentDate?.format('DD-MM-YYYY-HH-mm-ss')}`;
        const uploadUrl = await this.fireStorageService.uploadPhoto(path, file.file!);
        return { name: fileName!, attachmentUrl: uploadUrl, uploadDate: currentDate?.toDate() };
    }

}
