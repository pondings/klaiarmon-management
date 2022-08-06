import { ChangeDetectionStrategy, Component, Input, OnInit, ViewEncapsulation } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { Action } from "src/app/common/enum/action";
import { ConfirmModalOptions } from "./confirm-modal.model";

@Component({
    selector: 'app-confirm-modal',
    templateUrl: './confirm-modal.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class ConfirmModalComponent {

    @Input()
    modalOptions?: ConfirmModalOptions;

    constructor(private ngbActionModal: NgbActiveModal) {}

    get isActionDelete(): boolean {
        return this.modalOptions?.action === Action.DELETE;
    }

}
