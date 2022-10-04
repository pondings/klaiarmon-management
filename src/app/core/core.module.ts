import { NgModule } from "@angular/core";
import { EditProfileModule } from "./edit-profile/edit-profile.module";
import { ExpenseAlertModule } from "./expense-alert/expense-alert.module";
import { HeaderModule } from "./header/header.module";
import { DataService } from "./services/data-service";
import { FireAuthService } from "./services/fire-auth.service";
import { FireStorageService } from "./services/fire-storage.service";
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
        SidebarModule,
        EditProfileModule,
        ExpenseAlertModule
    ],
    exports: [
        HeaderModule, 
        SpinnerModule, 
        ToastModule,
        SidebarModule
    ],
    providers: [
        FirestoreService, 
        LocalStorageService,
        FireAuthService,
        DataService,
        FireStorageService
    ]
})
export class CoreModule {}
