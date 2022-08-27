import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MemoSearchFormComponent } from "./components/memo-search-form/memo-search-form.component";
import { MemoSearchResultComponent } from "./components/memo-search-result/memo-search-result.component";
import { MemoComponent } from "./containers/memo.component";

@NgModule({
    declarations: [
        MemoComponent,
        MemoSearchResultComponent,
        MemoSearchFormComponent
    ],
    imports: [CommonModule]
})
export class MemoModule {}
