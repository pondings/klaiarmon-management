import { NgModule } from "@angular/core";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { EditProfileModule } from "./edit-profile/edit-profile.module";
import { HeaderModule } from "./header/header.module";
import { FireAuthService } from "./services/fire-auth.service";
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
        EditProfileModule
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
        FireAuthService
    ]
})
export class CoreModule {}
