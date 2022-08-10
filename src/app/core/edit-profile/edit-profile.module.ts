import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { NgbModalModule } from "@ng-bootstrap/ng-bootstrap";
import { EditProfileComponent } from "./edit-profile.component";
import { EditProfileService } from "./edit-profile.service";

@NgModule({
    declarations: [EditProfileComponent],
    providers: [EditProfileService],
    imports: [CommonModule, NgbModalModule, ReactiveFormsModule, FontAwesomeModule],
    exports: [EditProfileComponent]
})
export class EditProfileModule {}
