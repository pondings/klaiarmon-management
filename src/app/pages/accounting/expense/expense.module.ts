import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { DatePickerModule } from "src/app/shared/components/date-picker/date-picker.module";
import { ImageViewerModule } from "src/app/shared/components/image-viewer/image-viewer.module";
import { UserSelectorModule } from "src/app/shared/components/user-selector/user-selector.module";
import { SharedModule } from "src/app/shared/shared.module";
import { AccountingRoutingModule } from "../accounting-routing.module";
import { AddAttachmentSectionComponent } from "./components/add-attachment-section/add-attachment-section.component";
import { ExpenseModalComponent } from "./components/expense-modal/expense-modal.component";
import { ExpenseResultComponent } from "./components/expense-result/expense-result.component";
import { ExpenseSearchFormComponent } from "./components/expense-search-form/expense-search-form.component";
import { SharingSectionComponent } from "./components/sharing-section/sharing-section.component";
import { ExpenseComponent } from "./containers/expense/expense.component";
import { ExpenseService } from "./services/expense.service";

@NgModule({
    declarations: [
        ExpenseComponent,
        AddAttachmentSectionComponent,
        ExpenseModalComponent,
        ExpenseResultComponent,
        ExpenseSearchFormComponent,
        SharingSectionComponent
    ],
    providers: [ExpenseService],
    imports: [
        CommonModule,
        SharedModule,
        ReactiveFormsModule,
        AccountingRoutingModule,
        FontAwesomeModule,
        UserSelectorModule,
        DatePickerModule,
        ImageViewerModule
    ]
})
export class ExpenseModule {}
