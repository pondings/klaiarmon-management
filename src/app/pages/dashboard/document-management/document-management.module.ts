import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { DatePickerModule } from "src/app/shared/components/date-picker/date-picker.module";
import { UserSelectorModule } from "src/app/shared/components/user-selector/user-selector.module";
import { SharedModule } from "src/app/shared/shared.module";
import { DocumentSearchFormComponent } from "./components/document-search-form/document-search-form.component";
import { DocumentUploadModalComponent } from "./components/document-upload-modal/document-upload-modal.component";
import { DocumentManagementComponent } from "./containers/document-management.component";
import { DocumentManagementService } from "./services/document-management.service";

@NgModule({
    declarations: [
        DocumentManagementComponent,
        DocumentSearchFormComponent,
        DocumentUploadModalComponent
    ],
    providers: [DocumentManagementService],
    imports: [
        CommonModule,
        SharedModule,
        DatePickerModule,
        UserSelectorModule
    ]
})
export class DocumentManagementModule {}
