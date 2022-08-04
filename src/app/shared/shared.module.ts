import { NgModule } from "@angular/core";
import { FirestoreService } from "./services/firestore.service";
import { LocalStorageService } from "./services/local-storage.service";

@NgModule({
    providers: [LocalStorageService, FirestoreService]
})
export class SharedModule { }
