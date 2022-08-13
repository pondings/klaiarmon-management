import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { NgbTypeaheadModule } from "@ng-bootstrap/ng-bootstrap";
import { UserSelectorComponent } from "./user-selector.component";

@NgModule({
    declarations: [UserSelectorComponent],
    imports: [
        CommonModule, 
        ReactiveFormsModule,
        FontAwesomeModule, 
        NgbTypeaheadModule
    ],
    exports: [UserSelectorComponent]
})
export class UserSelectorModule { }
