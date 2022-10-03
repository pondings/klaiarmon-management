import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { NgbTypeaheadModule } from "@ng-bootstrap/ng-bootstrap";
import { DropdownComponent } from "./dropdown.component";

@NgModule({
    declarations: [DropdownComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FontAwesomeModule, 
        NgbTypeaheadModule
    ],
    exports: [DropdownComponent]
})
export class DropdownModule {}
