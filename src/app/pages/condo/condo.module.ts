import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { CondoRoutingModule } from "./condo-routing.module";
import { CondoComponent } from "./containers/condo/condo.component";
import { CondoDocumentComponent } from "./containers/document/document.component";

@NgModule({
    declarations: [CondoComponent, CondoDocumentComponent],
    imports: [CommonModule, CondoRoutingModule]
})
export class CondoModule { }
