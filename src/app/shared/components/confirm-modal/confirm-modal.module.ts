import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NgbModalModule } from "@ng-bootstrap/ng-bootstrap";
import { ConfirmModalComponent } from "./confirm-modal.component";

@NgModule({
    declarations: [ConfirmModalComponent],
    imports: [CommonModule, NgbModalModule],
    exports: [ConfirmModalComponent]
})
export class ConfirmModalModule {}
