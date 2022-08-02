import { NgModule } from "@angular/core";
import { HeaderModule } from "./header/header.module";
import { SpinnerModule } from "./spinner/spinner.module";

@NgModule({
    imports: [HeaderModule, SpinnerModule],
    exports: [HeaderModule, SpinnerModule]
})
export class CoreModule {}
