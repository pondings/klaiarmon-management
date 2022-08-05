import { NgModule } from "@angular/core";
import { HeaderModule } from "./header/header.module";
import { FirestoreService } from "./services/firestore.service";
import { LocalStorageService } from "./services/local-storage.service";
import { SidebarModule } from "./sidebar/sidebar.module";
import { SpinnerModule } from "./spinner/spinner.module";
import { ToastModule } from "./toast/toast.module";

@NgModule({
    imports: [
        HeaderModule, 
        SpinnerModule, 
        ToastModule,
        SidebarModule
    ],
    exports: [
        HeaderModule, 
        SpinnerModule, 
        ToastModule,
        SidebarModule
    ],
    providers: [FirestoreService, LocalStorageService]
})
export class CoreModule {}
