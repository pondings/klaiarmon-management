import { NgModule } from "@angular/core";
import { HeaderModule } from "./header/header.module";
import { SpinnerModule } from "./spinner/spinner.module";
import { ToastModule } from "./toast/toast.module";

@NgModule({
    imports: [HeaderModule, SpinnerModule, ToastModule],
    exports: [HeaderModule, SpinnerModule, ToastModule]
})
export class CoreModule {}
