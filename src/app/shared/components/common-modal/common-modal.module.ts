import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NgbModalModule } from "@ng-bootstrap/ng-bootstrap";
import { CommonModalComponent } from "./common-modal.component";

@NgModule({
    declarations: [CommonModalComponent],
    imports: [CommonModule, NgbModalModule]
})
export class CommonModalModule {}
