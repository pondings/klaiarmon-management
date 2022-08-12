import { HttpClientJsonpModule, HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { NgbDatepickerModule } from "@ng-bootstrap/ng-bootstrap";
import { UsernamePipe } from "./pipe/username.pipe";
import { HttpService } from "./services/http.service";

@NgModule({
    declarations: [UsernamePipe],
    imports: [HttpClientModule, HttpClientJsonpModule],
    providers: [HttpService],
    exports: [ReactiveFormsModule, NgbDatepickerModule, UsernamePipe]
})
export class SharedModule { }
