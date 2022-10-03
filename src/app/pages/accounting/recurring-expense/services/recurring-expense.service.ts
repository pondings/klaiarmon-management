import { Injectable } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Action } from "src/app/common/enum/action";
import { RecurringExpenseModalComponent } from "../components/recurring-expense-modal/recurring-expense-modal.component";

@Injectable()
export class RecurringExpenseService {
    
    constructor(private modalService: NgbModal) {}

    async addRecurringExpense(): Promise<void> {
        const modalRef = this.modalService.open(RecurringExpenseModalComponent, { centered: true, backdrop: 'static' });
        modalRef.componentInstance.action = Action.CREATE;

        await modalRef.result.then(async (data: any) => {
            console.log(data);
        }, err => { });
    }

}
