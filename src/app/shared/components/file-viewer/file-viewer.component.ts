import { AfterViewInit, ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { SpinnerService } from "src/app/core/spinner/spinner.service";

@Component({
    selector: 'app-file-viewer',
    templateUrl: './file-viewer.component.html',
    styles: ['app-file-viewer { ngx-doc-viewer { height: 60vh; } }'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class FileViewerComponent implements AfterViewInit {

    @Input()
    fileUrl!: string;

    constructor(private activeModal: NgbActiveModal,
        private spinnerService: SpinnerService) {}

    ngAfterViewInit(): void {
        setTimeout(() => this.spinnerService.show(), 100);
        setTimeout(() => this.spinnerService.hide(), 10000);
    }

    documentLoaded(): void {
        this.spinnerService.hide();
    }

    dismiss(): void {
        this.activeModal.dismiss();
    }

}
