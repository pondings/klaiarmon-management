import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { NgbDatepickerModule } from "@ng-bootstrap/ng-bootstrap";
import { FirestoreService } from "./services/firestore.service";
import { LocalStorageService } from "./services/local-storage.service";

@NgModule({
    providers: [LocalStorageService, FirestoreService],
    exports: [ReactiveFormsModule, NgbDatepickerModule]
})
export class SharedModule { }
