import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from "@angular/core";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { UserBillingInfo } from "../../model/user-billing-info.model";

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

    faCaretDown = faCaretDown;
    
    isExpenseCollapsed = true;

    constructor(private activeModal: NgbActiveModal) {}

    dismiss(): void {
        this.activeModal.dismiss();
    }

}
