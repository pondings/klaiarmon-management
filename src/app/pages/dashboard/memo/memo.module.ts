import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { DatePickerModule } from "src/app/shared/components/date-picker/date-picker.module";
import { UserSelectorModule } from "src/app/shared/components/user-selector/user-selector.module";
import { SharedModule } from "src/app/shared/shared.module";
import { MemoSearchFormComponent } from "./components/memo-search-form/memo-search-form.component";
import { MemoSearchResultComponent } from "./components/memo-search-result/memo-search-result.component";
import { MemoEditComponent } from "./containers/memo-edit/memo-edit.component";
import { MemoSearchComponent } from "./containers/memo-search/memo-search.component";

@NgModule({
    declarations: [
        MemoSearchComponent,
        MemoEditComponent,
        MemoSearchResultComponent,
        MemoSearchFormComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        DatePickerModule,
        UserSelectorModule
    ]
})
export class MemoModule {}
