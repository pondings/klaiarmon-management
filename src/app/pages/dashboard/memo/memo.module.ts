import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MemoSearchResultComponent } from "./components/memo-search-result/memo-search-result.component";
import { MemoComponent } from "./containers/memo.component";

@NgModule({
    declarations: [
        MemoComponent,
        MemoSearchResultComponent
    ],
    imports: [CommonModule]
})
export class MemoModule {}
