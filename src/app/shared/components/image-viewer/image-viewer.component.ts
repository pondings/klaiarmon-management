import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
    selector: 'app-image-viewer',
    templateUrl: './image-viewer.component.html',
    styles: [
        'app-image-viewer { img { width: 100%; height: 100%; } }'
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class ImageViewerComponent {

    @Input()
    imgUrl!: string;

    constructor(private activeModal: NgbActiveModal) { }

    dismiss(): void {
        this.activeModal.dismiss();
    }

}
