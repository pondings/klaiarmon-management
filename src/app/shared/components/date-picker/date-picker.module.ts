import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { NgbDatepickerModule } from "@ng-bootstrap/ng-bootstrap";
import { DatePickerComponent } from "./date-picker.component";

@NgModule({
    declarations: [DatePickerComponent],
    imports: [
        CommonModule, 
        ReactiveFormsModule,
        NgbDatepickerModule,
        FontAwesomeModule
    ],
    exports: [DatePickerComponent]
})
export class DatePickerModule { }
