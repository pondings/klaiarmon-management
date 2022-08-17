import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
    selector: 'app-common-modal',
    templateUrl: 'common-modal.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class CommonModalComponent {

    @Input()
    title!: string;

    @Input()
    content!: string;

    constructor(private activeModal: NgbActiveModal) {}

    dismiss(): void {
        this.activeModal.close();
    }

}
