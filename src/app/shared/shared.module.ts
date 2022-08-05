import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { NgbDatepickerModule } from "@ng-bootstrap/ng-bootstrap";
import { LocalStorageService } from "../core/services/local-storage.service";

@NgModule({
    providers: [LocalStorageService],
    exports: [ReactiveFormsModule, NgbDatepickerModule]
})
export class SharedModule { }
