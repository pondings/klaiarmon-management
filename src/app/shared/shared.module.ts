import { HttpClientJsonpModule, HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { NgbDatepickerModule } from "@ng-bootstrap/ng-bootstrap";
import { HttpService } from "./services/http.service";

@NgModule({
    imports: [HttpClientModule, HttpClientJsonpModule],
    providers: [HttpService],
    exports: [ReactiveFormsModule, NgbDatepickerModule]
})
export class SharedModule { }
