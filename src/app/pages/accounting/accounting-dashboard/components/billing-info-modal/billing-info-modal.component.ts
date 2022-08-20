import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewEncapsulation } from "@angular/core";
import { faCaretDown, faUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { mapTo, sumNumber } from "src/app/common/utils/common-util";
import { UserBillingInfo, BillingInfo } from "../../model/user-billing-info.model";

@Component({
    selector: 'app-billing-info-modal',
    templateUrl: './billing-info-modal.component.html',
    styleUrls: ['./billing-info-modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class BillingInfoModalComponent {

    @Input()
    billingInfo!: UserBillingInfo;

    @Output()
    viewExpenseInfo = new EventEmitter<string>();

    faCaretDown = faCaretDown;
    faUpRightFromSquare = faUpRightFromSquare;
    
    isExpenseCollapsed = true;
    isDebtorCollapsed = true;
    isCreditorCollapsed = true;

    constructor(private activeModal: NgbActiveModal) {}

    dismiss(): void {
        this.activeModal.dismiss();
    }

    calculateTotalAmount(billingInfos: BillingInfo[]): number {
        return billingInfos.map(mapTo('amount')).reduce(sumNumber, 0);
    }

    viewExpense(documentId: string): void {
        this.viewExpenseInfo.emit(documentId);
    }

}
