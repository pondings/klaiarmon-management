import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { NgbDropdownModule } from "@ng-bootstrap/ng-bootstrap";
import { CommonModalModule } from "src/app/shared/components/common-modal/common-modal.module";
import { NotificationComponent } from "./notification.component";
import { NotificationService } from "./notification.service";

@NgModule({
    declarations: [NotificationComponent],
    providers: [NotificationService],
    imports: [
        CommonModule, 
        FontAwesomeModule,
        NgbDropdownModule,
        CommonModalModule
    ],
    exports: [NotificationComponent]
})
export class NotificationModule {}
