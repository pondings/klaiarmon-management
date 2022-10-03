import { HttpClientJsonpModule, HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { NgbCollapseModule, NgbDatepickerModule } from "@ng-bootstrap/ng-bootstrap";
import { DefaultValuePipe } from "./pipe/default-value.pipe";
import { OrdinalPipe } from "./pipe/ordinal.pipe";
import { StatusPipe } from "./pipe/status.pipe";
import { UsernamePipe } from "./pipe/username.pipe";
import { HttpService } from "./services/http.service";
import { PushNotificationService } from "./services/push-notification.service";

@NgModule({
    declarations: [
        UsernamePipe, 
        StatusPipe,
        OrdinalPipe,
        DefaultValuePipe
    ],
    providers: [
        HttpService, 
        PushNotificationService, 
        UsernamePipe,
        StatusPipe,
        OrdinalPipe,
        DefaultValuePipe
    ],
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
        FontAwesomeModule,
        StatusPipe,
        OrdinalPipe,
        DefaultValuePipe
    ]
})
export class SharedModule { }
