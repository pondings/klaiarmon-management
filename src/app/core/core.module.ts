import { NgModule } from "@angular/core";
import { HeaderModule } from "./header/header.module";
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
    ]
})
export class CoreModule {}
