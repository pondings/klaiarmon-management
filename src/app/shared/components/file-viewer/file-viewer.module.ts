import { NgModule } from "@angular/core";
import { NgxDocViewerModule } from "ngx-doc-viewer";
import { FileViewerComponent } from "./file-viewer.component";

@NgModule({
    declarations: [FileViewerComponent],
    imports: [NgxDocViewerModule]
})
export class FileViewerModule {}
