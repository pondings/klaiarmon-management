import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { NotificationModule } from "../notification/notification.module";
import { HeaderComponent } from "./header.component";

@NgModule({
    declarations: [HeaderComponent],
    imports: [
        CommonModule, 
        FontAwesomeModule, 
        RouterModule,
        NotificationModule
    ],
    exports: [HeaderComponent]
})
export class HeaderModule { }
