import { ChangeDetectionStrategy, Component, Input, OnInit, ViewEncapsulation } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { BehaviorSubject } from "rxjs";
import { Action } from "src/app/common/enum/action";
import { ConfirmModalOptions } from "./confirm-modal.model";

@Component({
    selector: 'app-confirm-modal',
    templateUrl: './confirm-modal.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class ConfirmModalComponent implements OnInit {

    @Input()
    modalOptions?: ConfirmModalOptions;

    modalOptions$ = new BehaviorSubject<Partial<ConfirmModalOptions>>({});

    constructor(private ngbActionModal: NgbActiveModal) {}

    ngOnInit(): void {
    }

}
