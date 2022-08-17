import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { NotificationComponent } from "./notification.component";
import { NotificationService } from "./notification.service";

@NgModule({
    declarations: [NotificationComponent],
    providers: [NotificationService],
    imports: [CommonModule, FontAwesomeModule],
    exports: [NotificationComponent]
})
export class NotificationModule {}
