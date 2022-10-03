import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { Action } from "src/app/common/enum/action";

@Component({
    selector: 'app-recurring-expense-modal',
    templateUrl: './recurring-expense-modal.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class RecurringExpenseModalComponent {

    @Input()
    action!: Action;

    constructor(private activeModal: NgbActiveModal) {}

    dismiss(): void {
        this.activeModal.dismiss();
    }

}
