import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NgbModalModule } from "@ng-bootstrap/ng-bootstrap";
import { ImageViewerComponent } from "./image-viewer.component";

@NgModule({
    declarations: [ImageViewerComponent],
    imports: [CommonModule, NgbModalModule],
    exports: [ImageViewerComponent]
})
export class ImageViewerModule {

}
