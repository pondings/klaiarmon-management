import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NgbToastModule } from "@ng-bootstrap/ng-bootstrap";
import { ToastComponent } from "./toast.component";
import { ToastService } from './toast.service';

@NgModule({
    declarations: [ToastComponent],
    imports: [CommonModule, NgbToastModule],
    exports: [ToastComponent],
    providers: [ToastService]
})
export class ToastModule {}
