import { HttpClientJsonpModule, HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { NgbCollapseModule, NgbDatepickerModule } from "@ng-bootstrap/ng-bootstrap";
import { UsernamePipe } from "./pipe/username.pipe";
import { HttpService } from "./services/http.service";
import { PushNotificationService } from "./services/push-notification.service";

@NgModule({
    declarations: [UsernamePipe],
    providers: [HttpService, PushNotificationService, UsernamePipe],
    imports: [
        HttpClientModule, 
        HttpClientJsonpModule, 
        NgbDatepickerModule
    ],
    exports: [
        ReactiveFormsModule, 
        NgbDatepickerModule, 
        UsernamePipe,
        NgbCollapseModule,
        FontAwesomeModule
    ]
})
export class SharedModule { }
